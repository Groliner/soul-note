import oauth2Request from '@/utils/oauth2Request'

export const login = (username, password, remember) =>
  oauth2Request.post('login', {
    username,
    password,
    'remember-me': remember
  })

export const register = (data) => oauth2Request.put('user/register', data)

export const logout = () => oauth2Request.post('logout')

export const getAuthorizationCode = () =>
  oauth2Request.get(
    'oauth2/authorize?client_id=login-client&response_type=code&redirect_uri=https://grolin.cn/home&scope=openid'
  )

export const getAccessToken = (code) =>
  oauth2Request.post(
    'oauth2/token',
    {
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://grolin.cn/home'
    },
    {
      headers: {
        Authorization: 'Basic bG9naW4tY2xpZW50Om9wZW5pZC1jb25uZWN0'
      }
    }
  )

export const refreshToken = (refreshToken) =>
  oauth2Request.post(
    'oauth2/token',
    {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    {
      headers: {
        Authorization: 'Basic bG9naW4tY2xpZW50Om9wZW5pZC1jb25uZWN0'
      }
    }
  )

export const introspectToken = (token) =>
  oauth2Request.post(
    'oauth2/introspect',
    {
      token
    },
    {
      headers: {
        Authorization: 'Basic bG9naW4tY2xpZW50Om9wZW5pZC1jb25uZWN0'
      }
    }
  )

export const revokeToken = (token, token_type_hint = 'access_token') =>
  oauth2Request.post(
    'oauth2/revoke',
    {
      token,
      token_type_hint
    },
    {
      headers: {
        Authorization: 'Basic bG9naW4tY2xpZW50Om9wZW5pZC1jb25uZWN0'
      }
    }
  )

export const getUserInfo = () => oauth2Request.get('user/self')
