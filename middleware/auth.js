/*
  ログイン済ユーザー以外弾きたい場合はこのmiddlewareを利用
  middleware: 'auth'
 */
export default function({ store, error }) {
  if (!store.state.authUser) {
    error({
      message: 'ログインしてください',
      statusCode: 403
    })
  }
}
