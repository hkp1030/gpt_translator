(() => {
    const form = document.getElementById('translateForm');
    const key = document.getElementsByName('csrfmiddlewaretoken');
    const translateBtn = document.getElementById('translateBtn');
    const langBtn = document.getElementById('langBtn');

    const selectLeft = document.querySelector(".select__lt");
    const selectRight = document.querySelector(".select__rt");
    const label = document.querySelectorAll('.translateSelect__select__btn');
    const item = document.querySelector('.translateSelect__select__lang');

    const result = document.getElementById('result');
    const textarea = document.querySelector('.translateSelect__textarea__input');
    const textareaLength = document.querySelector('.translateSelect__textarea__limit--num');



    // this function is translate result
    const resultTranslate = () => {
        const body = {
            orig_lang: selectLeft.innerText,
            target_lang: selectRight.innerText,
            text: textarea.value,
        }
        const resultText = document.getElementById('result')
        resultText.innerText = ''

        fetch('translate/', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'X-CSRFToken': key[0].defaultValue},
            mode: 'same-origin',
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
        event.preventDefault();
        resultTranslate()
    });


    // Click outside the selection to close the options
    window.addEventListener('click', (event) => {
        const selectLt = document.querySelector('.container__lt').classList
        const selectRt = document.querySelector('.container__rt').classList
        if (event.target !== item && event.target !== selectLeft) {
            selectLt.remove('active');
        }
        
        if (event.target !== item && event.target !== selectRight) {
            selectRt.remove('active');
        }
    })

    // custom select
    label.forEach((label) => {
        label.addEventListener('click', () => {
            let optionList = label.nextElementSibling;
            let options = optionList.querySelectorAll('.translateSelect__select__lang--option');
            clickLabel(label, options);
        })
    });

<<<<<<< Updated upstream
    const clickLabel = (lb, optionItems) => {
        if(lb.parentNode.classList.contains('active')) {
            optionItems.forEach((opt) => {
                // remove를 못해주고 있음
                const func = () => {handleSelect(lb, opt)}
=======
    const clickLabel = (label, options) => {
        if (label.parentNode.classList.contains('active')) {
            options.forEach((opt) => {
                const func = () => {
                    handleSelect(label, opt)
                }
                // remove를 못해주고 있음
>>>>>>> Stashed changes
                opt.removeEventListener('click', func)
            })
            label.parentNode.classList.remove('active');
        } else {
<<<<<<< Updated upstream
            lb.parentNode.classList.add('active');
            optionItems.forEach((opt) => {
                const func = () => {handleSelect(lb, opt)}
=======
            label.parentNode.classList.add('active');
            options.forEach((opt) => {
                const func = () => {
                    handleSelect(label, opt)
                }
>>>>>>> Stashed changes
                opt.addEventListener('click', func)
                // console.log(label.innerText)
            })
        }
    };

    const handleSelect = (label, item) => {
        let tmp = label.innerText
        label.innerText = item.innerText;
        label.parentNode.classList.remove('active');
        if (selectLeft.innerText === selectRight.innerText) {
            if (label.classList.contains('select__lt')) {
                selectRight.innerText = tmp
            } else {
                selectLeft.innerText = tmp
            }
            let tmpTextarea = result.textContent
            result.textContent = textarea.value
            textarea.value = tmpTextarea
            tmpTextarea = ''
        }
        tmp = ''
        // 중복 처리 해결 안돼서 번역 다중에러남
        // resultTranslate()
    };


    // Textarea Textlength
    textarea.addEventListener('input', (event) => {
        if (event.target.value.length > 1000) {
            return
        }
        textareaLength.textContent = event.target.value.length
    })
})()