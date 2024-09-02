/*
 * @Author: Gro lin
 * @Date: 2024-09-02 17:25:17
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-09-02 20:53:43
 */
// 导出 AES 密钥
async function exportKey(key) {
  const exported = await crypto.subtle.exportKey(
    'jwk', // 导出为 JWK 格式
    key
  )
  return JSON.stringify(exported) // 序列化为 JSON 字符串，便于存储
}
// 根据jwkKey导入密钥
async function importKey(jwkKey) {
  const keyData = JSON.parse(jwkKey) // 反序列化为对象
  return crypto.subtle.importKey(
    'jwk',
    keyData,
    {
      name: 'AES-GCM'
    },
    true,
    ['encrypt', 'decrypt']
  )
}

function arrayBufferToBase64(buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function base64ToArrayBuffer(base64) {
  const binary = window.atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function simpleXOR(data) {
  const key = new Uint8Array([42, 37, 21]) // 一个简单的混淆密钥
  const result = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length]
  }
  return result
}

function serializeEncryptedData(encryptedData) {
  const ivXOR = simpleXOR(encryptedData.iv)
  const ciphertextXOR = simpleXOR(encryptedData.ciphertext)

  const combined =
    arrayBufferToBase64(ivXOR.buffer) + ':' + arrayBufferToBase64(ciphertextXOR.buffer)
  return btoa(combined)
}

function deserializeEncryptedData(serializedData) {
  try {
    const decoded = atob(serializedData)
    const [ivBase64, ciphertextBase64] = decoded.split(':')

    const ivXOR = new Uint8Array(base64ToArrayBuffer(ivBase64))
    const ciphertextXOR = new Uint8Array(base64ToArrayBuffer(ciphertextBase64))

    return {
      iv: simpleXOR(ivXOR),
      ciphertext: simpleXOR(ciphertextXOR)
    }
  } catch (e) {
    return null
  }
}

export const generateAESKey = async (password, saveName, salts) => {
  const encoder = new TextEncoder()
  const salt = encoder.encode('soul note' + salts) // 生成随机盐值
  // 使用用户密码导入密钥
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  // 使用PBKDF2生成AES密钥
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // 设置为true，使得密钥是可导出的
    ['encrypt', 'decrypt']
  )
  if (saveName) {
    localStorage.setItem(saveName, await exportKey(key))
  }
  return await exportKey(key)
}
// 加解密
export async function encryptData(data, accesskey) {
  if (accesskey === undefined || accesskey === null) {
    const storedKey = localStorage.getItem('diaryAccessKey')
    if (storedKey === null) return
    accesskey = await importKey(storedKey)
  }
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 随机生成IV
  const encoder = new TextEncoder()

  // 使用AES-GCM加密日记内容
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    accesskey,
    encoder.encode(data)
  )
  return serializeEncryptedData({ ciphertext: new Uint8Array(ciphertext), iv: iv })
}

export async function decryptData(encryptedData) {
  const de = deserializeEncryptedData(encryptedData)
  // 如果没有加密数据，直接返回
  if (de === null) return encryptedData
  const { ciphertext, iv } = de
  const storedKey = localStorage.getItem('diaryAccessKey')
  if (storedKey === null) return
  const accesskey = await importKey(storedKey)
  const decoder = new TextDecoder()

  // 使用AES-GCM模式解密日记内容
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    accesskey,
    ciphertext
  )

  return decoder.decode(decryptedData)
}

export async function encryptPassword(password) {
  const encryptionKey = 'soul note' // 加密密钥
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(encryptionKey),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(encryptionKey),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  )

  // 生成随机 IV（初始化向量）
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // 加密
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    new TextEncoder().encode(password)
  )

  // 将 IV 和密文都编码为 Base64 字符串
  const ivStr = btoa(String.fromCharCode(...iv))
  const encryptedStr = btoa(String.fromCharCode(...new Uint8Array(encrypted)))

  // 返回拼接的字符串（IV:密文）
  return `${ivStr}:${encryptedStr}`
}
