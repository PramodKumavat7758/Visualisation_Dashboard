from django import forms

class NullableIntegerField(forms.IntegerField):
    """Custom IntegerField to handle empty strings and null values."""
    def to_python(self, value):
        if value in (None, '', 'null'):  # Treat empty or 'null' as None
            return None
        return super().to_python(value)


class DataPointForm(forms.Form):
    # Integer fields with nullable handling
    intensity = NullableIntegerField(required=False)
    likelihood = NullableIntegerField(required=False)
    relevance = NullableIntegerField(required=False)
    start_year = NullableIntegerField(required=False)

    # String fields
    country = forms.CharField(max_length=100, required=False)
    topic = forms.CharField(max_length=100, required=False)
    sector = forms.CharField(max_length=100, required=False)
    region = forms.CharField(max_length=100, required=False)
    pestle = forms.CharField(max_length=100, required=False)
    source = forms.CharField(max_length=100, required=False)
    insight = forms.CharField(max_length=255, required=False)
    url = forms.URLField(required=False)
    title = forms.CharField(max_length=255, required=False)
