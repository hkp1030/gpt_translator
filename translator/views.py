import openai
from django.http import StreamingHttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .forms import TranslatorForm


def index(request):
    return render(request, 'translator/index.html')


@require_POST
def translate(request):
    form = TranslatorForm(request.POST)

    if form.is_valid():
        text = form.cleaned_data['text']
        orig_lang = form.cleaned_data['orig_lang']
        target_lang = form.cleaned_data['target_lang']

        command1 = f'You are a helpful assistant that translates {orig_lang} to {target_lang}.'
        command2 = f'Translate the following {orig_lang} text to {target_lang}: "{text}"'
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': command1},
                {'role': 'user', 'content': command2},
            ],
            temperature=0,
            stream=True
        )
        return StreamingHttpResponse(
            (chunk.choices[0].delta.get('content', '') for chunk in response),
            content_type="text/plain"
        )
    else:
        return HttpResponseBadRequest('Failed form validation.')
