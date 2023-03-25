(() => {
    const form = document.getElementById('translateForm')
    const translateBtn = document.getElementById('translateBtn')

    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })

    translateBtn.addEventListener('click', event => {
        const resultText = document.getElementById('result')
        resultText.innerText = ''

        fetch('translate/', {
            method: 'POST',
            body: new FormData(form)
        })
            .then(response => {
                if (!response.body) {
                    throw new Error("No ReadableStream found.")
                }
                const reader = response.body.getReader()

                async function readStream() {
                    const {done, value} = await reader.read()
                    if (done) {
                        console.log("Stream complete.")
                        return
                    }

                    const decodeValue = new TextDecoder().decode(value)
                    resultText.append(decodeValue)

                    await readStream()
                }

                return readStream()
            })
            .catch(error => console.error(error))
    })
})()
