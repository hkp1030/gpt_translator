(() => {
    const form = document.getElementById('translateForm') as HTMLFormElement;
    const key = document.getElementsByName('csrfmiddlewaretoken') as NodeListOf<HTMLInputElement>;
    const translateBtn = document.getElementById('translateBtn') as HTMLButtonElement;
    const langBtn = document.getElementById('langBtn') as HTMLButtonElement;

    const selectLeft = document.querySelector(".select__lt") as HTMLElement;
    const selectRight = document.querySelector(".select__rt") as HTMLElement;
    const label = document.querySelectorAll('.translateSelect__select__btn') as NodeListOf<HTMLButtonElement>;
    const item = document.querySelector('.translateSelect__select__lang') as HTMLElement;

    const result = document.getElementById('result') as HTMLElement;
    const textarea = document.querySelector('.translateSelect__textarea__input') as HTMLInputElement;
    const textareaLength = document.querySelector('.translateSelect__textarea__limit--num') as HTMLSpanElement | any;


    form.addEventListener('submit', (event) => {
        event.preventDefault()
    })

    window.addEventListener('popstate', (event) => {
        if (event.state) {
            selectLeft.textContent = event.state.orig_lang
            selectRight.textContent = event.state.target_lang
            textarea.value = event.state.text
            result.innerText = event.state.result
        } else {
            selectLeft.textContent = 'English'
            selectRight.textContent = 'Korean'
            textarea.value = ''
            result.innerText = ''
        }
    })

    // this function is translate result
    const resultTranslate = () => {
        const resultText = document.getElementById('result') as HTMLElement
        resultText.innerText = ''

        const body = {
            orig_lang: selectLeft.innerText,
            target_lang: selectRight.innerText,
            text: textarea.value,
            csrfmiddlewaretoken: key[0].defaultValue
        }

        fetch('translate/', {
            method: 'POST',
            body: new URLSearchParams(body),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                if (!response.body) {
                    throw new Error("No ReadableStream found.")
                }
                const reader = response.body.getReader()

                async function readStream() {
                    const {done, value} = await reader.read()
                    if (done) {
                        const bodyWithResult = {...body, result: resultText.innerText}
                        window.history.pushState(
                            bodyWithResult,
                            '',
                            `?${new URLSearchParams(bodyWithResult).toString()}`
                        )
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
    let clickable = true;
    langBtn.addEventListener("click", () => {
        if (clickable === true && result.textContent !== '') {
            clickable = false
            let tmpSelect = selectLeft.textContent
            selectLeft.textContent = selectRight.textContent
            selectRight.textContent = tmpSelect

            // textarea <-> result change
            let tmpTextarea = result.textContent;
            result.textContent = textarea.value;
            (textarea.value as string | null) = tmpTextarea

            // Text가 설명식으로 나와서 변경할 때 이상한 번역이 너무 많이 나온다. 의논해볼것
            // resultTranslate()
            setTimeout(() => {
                clickable = true
            }, 300)
        }

        textareaLength.textContent = getTextareaLength(textarea.value)
    });

    let translateClickable = true;
    translateBtn.addEventListener('click', event => {
        event.preventDefault();
        if (textarea.value === '') return

        if (translateClickable === true) {
            translateClickable = false
            resultTranslate()

            // 연속 클릭 방지
            setTimeout(() => {
                translateClickable = true
            }, 500)
        }
    });


    // Click outside the selection to close the options
    window.addEventListener('click', (event) => {
        const selectLt = document.querySelector('.container__lt') as HTMLElement
        const selectRt = document.querySelector('.container__rt') as HTMLElement
        if (event.target !== item && event.target !== selectLeft) {
            selectLt.classList.remove('active');
        }

        if (event.target !== item && event.target !== selectRight) {
            selectRt.classList.remove('active');
        }
    })

    // custom select
    label.forEach((label) => {
        label.addEventListener('click', () => {
            let optionList: any = label.nextElementSibling;
            let options = optionList.querySelectorAll('.translateSelect__select__lang--option') as HTMLElement;
            clickLabel(label, options);
        })
    });

    const clickLabel = (label, options) => {
        if (label.parentNode.classList.contains('active')) {
            options.forEach((opt) => {
                const func = () => {
                    handleSelect(label, opt)
                }
                opt.removeEventListener('click', func)
            })
            label.parentNode.classList.remove('active');
        } else {
            label.parentNode.classList.add('active');
            options.forEach((opt) => {
                const func = () => {
                    handleSelect(label, opt)
                }
                opt.addEventListener('click', func)
            })
        }
    };

    const handleSelect = (label, opt) => {
        let tmp = label.innerText
        let newIcon = document.createElement('i');

        label.innerText = opt.innerText;

        newIcon.setAttribute('class', 'gg-chevron-down');
        label.appendChild(newIcon);
        label.parentNode.classList.remove('active');


        if (selectLeft.innerText === selectRight.innerText) {
            if (label.classList.contains('select__lt')) {
                selectRight.innerHTML = tmp + `<i class="gg-chevron-down"></i>`
            } else {
                selectLeft.innerHTML = tmp + `<i class="gg-chevron-down"></i>`
            }
            let tmpTextarea = result.textContent;
            result.textContent = textarea.value;
            (textarea.value as string | null) = tmpTextarea
            tmpTextarea = ''

            textareaLength.textContent = textarea.value.length

            // 양쪽 같은 언어 선택시 반대쪽 언어 변경되는 요소를 너무 빠르게 누르면 번역이 꼬임
            // resultTranslate()
        }

        tmp = ''
    };


    // Textarea Textlength
    textarea.addEventListener('input', (event: any) => {
        if (event.target.value.length > 2000) {
            return
        }

        textareaLength.textContent = getTextareaLength(event.target.value)
    })

    // Calculate textarea bytes
    const getTextareaLength = (str) => {
        let strLength = 0;

        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i)
            const ch = str.substr(i, 1).toUpperCase()

            if ((ch < "0" || ch > "9") && (ch < "A" || ch > "Z") && ((code > 255) || (code < 0))) {
                strLength = strLength + 2;
            } else {
                strLength = strLength + 1;
            }
        }

        return strLength;
    }
})()