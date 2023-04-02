import openai
from django.http import StreamingHttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .forms import TranslatorForm, ExplanationForm


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
        errors = form.errors.as_json()
        return JsonResponse({'status': 'error', 'errors': errors}, status=400)


@require_POST
def explanation(request):
    form = ExplanationForm(request.GET)

    if form.is_valid():
        type = form.cleaned_data['type']
        text = form.cleaned_data['text']
        orig_lang = form.cleaned_data['orig_lang']
        target_lang = form.cleaned_data['target_lang']

        command1 = f'You are a helpful assistant that teaches {orig_lang} using {target_lang}.'
        command2 = f'Explain the following {orig_lang} text in {target_lang} with a focus on {type}: "{text}"'
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {'role': 'system', 'content': command1},
                {'role': 'user', 'content': command2},
            ],
            temperature=0.2,
            stream=True
        )
        return StreamingHttpResponse(
            (chunk.choices[0].delta.get('content', '') for chunk in response),
            content_type="text/plain; charset=utf-8"
        )
    else:
        errors = form.errors.as_json()
        return JsonResponse({'status': 'error', 'errors': errors}, status=400)
