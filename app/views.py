from django.shortcuts import render
from django.http import JsonResponse
from mongoengine.queryset.visitor import Q
from .models import DataPoint

def dashboard(request):
    return render(request, "dashboard.html")

def get_filtered_data(request):

    filters = Q()
    for field in ['end_year', 'topic', 'sector', 'region', 'pestle', 'source', 'country', 'city']:
        value = request.GET.get(field, '').strip()
        if value:
            filters &= Q(**{field: value})

    try:
        data_points = DataPoint.objects.filter(filters)
        data = [
            {
                "intensity": dp.intensity,
                "likelihood": dp.likelihood,
                "relevance": dp.relevance,
                "year": dp.start_year,
                "country": dp.country,
                "topics": dp.topic,
                "region": dp.region,
                "city": dp.insight,
            }
            for dp in data_points
        ]
        return JsonResponse({"data": data}, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
