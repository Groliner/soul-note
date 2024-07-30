### UserService	

##### getUserInfoAPI

| 接口说明: | 用于处理关于用户操作的api,比如注册,登录,信息编辑以及获取. |
| :-------: | --------------------------------------------------------- |
|  接口API  | http://192.168.180.29:5173/api/user                       |
| 请求信息  | 标准的GET请求                                             |
| 响应示例  |                                                           |

```json
success:
{
    "code": 1,
    "msg": "success",
    "data": {
        "id": 79,
        "username": "....",
        "password": null,
        "avatar": "https://java-spring-mybatis.oss-ccom/...jpg",
        "email": ".....",
        "status": "active",
        "description": ".....",
        "lastReadDiaryId": 110,
        "backgroundImg": "https://java-spring-mybatis.oss....png",
        "createdTime": "2024-04-09T19:41:56",
        "updatedTime": "2024-07-05T15:16:57",
        "roles": null
    }
}
failure:
Unauthorized
未登录时请求该接口,前端会重定向到登录页面
```
