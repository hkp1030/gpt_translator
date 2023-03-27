(() => {
    const form = document.getElementById('translateForm')
    const translateBtn = document.getElementById('translateBtn')
    const langBtn = document.getElementById('langBtn')
    const selectLeft = document.querySelector(".lang_lt");
    const selectRight = document.querySelector(".lang_rt");

    // const result = document.getElementById('result')
    const textarea = document.querySelector(".translateSelect__textarea__input")

    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })

    // this function is translate result
    const resultTranslate = () => {
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
    }

    // change select box
    langBtn.addEventListener("click", () => {
        let tmpSelect = selectLeft.value
        selectLeft.value = selectRight.value
        selectRight.value = tmpSelect

        // let tmpTextarea = result
        // result = textarea
        // textarea = tmpTextarea
        // console.log(result.value, textarea.value)
        if (textarea.value !== '') resultTranslate()
    });

    translateBtn.addEventListener('click', event => {
        resultTranslate()
    })
})()
