from django import forms

LANGUAGE_CHOICES = [
    ('Korean', 'Korean'),
    ('English', 'English'),
    ('Japanese', 'Japanese'),
    ('Chinese', 'Chinese'),
    ('Spanish', 'Spanish'),
    ('French', 'French'),
    ('German', 'German'),
    ('Italian', 'Italian'),
    ('Portuguese', 'Portuguese'),
    ('Russian', 'Russian'),
]


class TranslatorForm(forms.Form):
    text = forms.CharField(max_length=2000)
    orig_lang = forms.ChoiceField(choices=LANGUAGE_CHOICES)
    target_lang = forms.ChoiceField(choices=LANGUAGE_CHOICES)


class ExplanationForm(forms.Form):
    TYPE_CHOICES = [
        ('grammar', 'grammar'),
        ('vocabulary', 'vocabulary'),
    ]

    type = forms.ChoiceField(choices=TYPE_CHOICES)
    text = forms.CharField(max_length=1000)
    orig_lang = forms.ChoiceField(choices=LANGUAGE_CHOICES)
    target_lang = forms.ChoiceField(choices=LANGUAGE_CHOICES)
