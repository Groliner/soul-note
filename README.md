<!--
 * @Author: Gro lin
 * @Date: 2024-04-10 07:09:02
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-04-10 13:30:18
-->

# soul-note

a web for my friends and myself

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## z-index

- fixed组件：100  
- 蒙版：301  
- nav:302  
- header:303  
- popup: 600  
- around black line: 1000

## logis

- 前端的数据都为及时存储,设计保存为向后端请求,所以前端不需要做save与temporary区分
- store 中的const常量,比如字典defaultPages,defaultUserInfo,会同步改变,尽管有JSON序列化.....
- 变量的相等判断用的全等,注意数字与字符的区别,route.query获得的为字符.
- 设置独立的Message Store用来规范提示信息
## BUG

### logout逻辑中:

```js
const logout = async () => {
  try {
    logOutAPI()
  } catch (e) {
    console.log(e)
  } finally {
    router.push('/login')
    consol.log(defaultUserInfo) 添加这一语句就可以重置defaultUserInfo,若注释则....
    userInfo.value = defaultUserInfo
    friends.value = defaultFriends
    userDiary.value = defaultDiary
    diaryStore.setDiary()
    diaryStore.setPages()
    console.log('ok')
  }
}
