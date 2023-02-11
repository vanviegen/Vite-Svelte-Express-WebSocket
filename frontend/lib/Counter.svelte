<script>
  let wsUrl = `ws${location.protocol.slice(4)}//${location.host}/api`

  let webSocket = new WebSocket(wsUrl);
  webSocket.onmessage = (event) => {
    let data = JSON.parse(event.data)
    if (data.command === 'setCount') {
      count = data.value;
    }
  }

  let count = '?'
  const increment = () => {
    count += 1
    webSocket.send(JSON.stringify({command: 'incrCount'}))
  }

</script>

<button on:click={increment}>
  count is {count}
</button>
