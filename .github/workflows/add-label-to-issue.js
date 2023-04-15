module.exports = async ({github, context}) => {

  return context.payload.client_payload.value
}
