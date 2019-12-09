export default async ({ req, route, store, $axios }) => {
  // 必ず最初はSSR
  if (process.server) {
    // 初回接続時はsessionにtemp_idがセットされていない
    if (!req.session.tempId) {
      // ユーザーの行動を識別するための, ランダムなunique_idを生成
      req.session.tempId = generateRandomUniqueId()
    }

    // 未ログインユーザーで2度目以降の接続の場合(sessionが切れていない場合)は,1度目に生成したunique_idを利用
    // することによって, ユーザーの識別文字列をstatefulなものにする

    // クライアントサイドでunique_idを利用できるように, Vuex Storeに格納
    store.dispatch('storeTempId', { tempId: req.session.tempId })
  }

  await $axios.$post('/api/logs/page_transition', {
    isSsr: process.server,
    path: route.path,
    tempId: store.state.tempId
  })
}

// ref: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function generateRandomUniqueId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  )
}
