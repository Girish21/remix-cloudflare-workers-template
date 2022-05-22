export default class CounterDurableObject {
  private count: number = 0

  constructor(private state: DurableObjectState) {
    this.state.blockConcurrencyWhile(async () => {
      let storedValue = await this.state.storage.get<number>('count')
      this.count = storedValue || 0
    })
  }

  async fetch(request: Request) {
    let url = new URL(request.url)
    let count = this.count

    switch (url.pathname) {
      case '/increment':
        ++count
        break
      case '/decrement':
        --count
        break
      case '/':
        break
      default:
        return new Response('Not Found', { status: 404 })
    }

    this.count = count
    this.state.storage.put('count', count)

    return new Response(count.toString())
  }
}
