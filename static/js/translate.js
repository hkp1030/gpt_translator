(() => {
    const form = document.getElementById('translateForm');
    const key = document.getElementsByName('csrfmiddlewaretoken');
    const translateBtn = document.getElementById('translateBtn');
    const langBtn = document.getElementById('langBtn');

    const selectLeft = document.querySelector(".select__lt");
    const selectRight = document.querySelector(".select__rt");
    const label = document.querySelectorAll('.translateSelect__select__btn');
    const item = document.querySelector('.translateSelect__select__lang');
    const options = document.querySelectorAll('.translateSelect__select__lang--option');

    const result = document.getElementById('result');
    const textarea = document.querySelector(".translateSelect__textarea__input");

    let formTextarea = "light";
    let formLeftLanguage = selectLeft.textContent;
    let formRightLanguage = selectRight.textContent;
 
    // fetch시 에러 발생 (formData구조로 받게 되어있어서?)
    const body = {
        orig_lang: formLeftLanguage,
        target_lang: formRightLanguage,
        text: formTextarea,
        csrfmiddlewaretoken: key[0].defaultValue,
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })

    // this function is translate result
    const resultTranslate = () => {
        const resultText = document.getElementById('result')
        resultText.innerText = ''

        fetch('translate/', {
            method: 'POST',
            body: JSON.stringify(body)
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
    };

    // change select box
    langBtn.addEventListener("click", () => {
        let tmpSelect = selectLeft.textContent
        selectLeft.textContent = selectRight.textContent
        selectRight.textContent = tmpSelect

        // textarea <-> result change
        let tmpTextarea = result.textContent
        result.textContent = textarea.value
        textarea.value = tmpTextarea
        if (textarea.value !== '') resultTranslate()
    });

    translateBtn.addEventListener('click', event => {
        resultTranslate()
    });

    label.forEach((lb) => {
        lb.addEventListener('click', () => {
            let optionList = lb.nextElementSibling;
            let optionItems = optionList.querySelectorAll('.translateSelect__select__lang--option');
            clickLabel(lb, optionItems);
        })
    });

    const clickLabel = (lb, optionItems) => {
        if(lb.parentNode.classList.contains('active')) {
            lb.parentNode.classList.remove('active');
            optionItems.forEach((opt) => {
                // remove를 못해주고 있음
                opt.removeEventListener('click', () => {
                    handleSelect(lb, opt)
                })
            })
        } else {
            lb.parentNode.classList.add('active');
            optionItems.forEach((opt) => {
                opt.addEventListener('click', () => {
                    handleSelect(lb, opt)
                })
            })
        }
    };

    const handleSelect = (label, item) => {
        label.textContent = item.textContent;
        label.parentNode.classList.remove('active');

        // 누적되는 현상 해결중
        console.log(label.textContent, item.textContent)
    };
})()