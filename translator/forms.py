from django import forms

LANGUAGE_CHOICES = [
    ('Korean', 'Korean'),
    ('English', 'English'),
]


class TranslatorForm(forms.Form):
    text = forms.CharField(max_length=1000)
    orig_lang = forms.ChoiceField(choices=LANGUAGE_CHOICES)
    target_lang = forms.ChoiceField(choices=LANGUAGE_CHOICES)
