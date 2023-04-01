(() => {
    // tsc name.ts 로 js 컴파일 후 작동시킬것
    // JS로 대충 작성하고 TS넣는게 좋을 것 같다.
    
    const form = document.getElementById('translateForm') as HTMLElement;
    const key = document.getElementsByName('csrfmiddlewaretoken') as NodeListOf<HTMLInputElement>;
    const translateBtn = document.getElementById('translateBtn') as HTMLElement;
    const langBtn = document.getElementById('langBtn') as HTMLElement;

    const selectLeft = document.querySelector(".select__lt") as HTMLElement;
    const selectRight = document.querySelector(".select__rt") as HTMLElement;
    const label = document.querySelectorAll('.translateSelect__select__btn') as NodeListOf<HTMLElement>;
    const item = document.querySelector('.translateSelect__select__lang') as HTMLElement;
    const options = document.querySelectorAll('.translateSelect__select__lang--option') as NodeListOf<HTMLElement>;

    const result = document.getElementById('result') as HTMLElement;
    const textarea = document.querySelector(".translateSelect__textarea__input") as HTMLInputElement;

    let formTextarea = "light";
    let formLeftLanguage = selectLeft.textContent;
    let formRightLanguage = selectRight.textContent;
 
    // fetch시 에러 발생 (formData구조로 받게 되어있어서?)
    const body = {
        orig_lang: formLeftLanguage,
        target_lang: formRightLanguage,
        text: formTextarea,
    }

    form.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault()
    })

    // this function is translate result
    const resultTranslate = () => {
        const resultText = document.getElementById('result') as HTMLElement
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
        resultTranslate()
    });

    label.forEach((lb: HTMLElement) => {
        lb.addEventListener('click', () => {
            let optionList = lb.nextElementSibling;
            console.log(optionList)
            let optionItems = optionList.querySelectorAll('.translateSelect__select__lang--option');
            clickLabel(lb, optionItems);
        })
    });

    const clickLabel = (lb, optionItems) => {
        if(lb.parentNode.classList.contains('active')) {
            lb.parentNode.classList.remove('active');
            optionItems.forEach((opt) => {
                // remove를 못해주고 있음
                const func = () => { handleSelect(lb, opt) }
                opt.removeEventListener('click', func)
            })
        } else {
            lb.parentNode.classList.add('active');
            optionItems.forEach((opt) => {
                const func = () => { handleSelect(lb, opt) }
                opt.addEventListener('click', func)
            })
        }
    };

    const handleSelect = (label, item) => {
        label.textContent = item.textContent;
        label.parentNode.classList.remove('active');
    };
})()