"""
Tailors API: list/create/update/delete tailors for dashboard and frontend.
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404

from .models import Tailor


def _tailor_to_dict(t):
    return {
        'id': str(t.pk),
        'name': t.name,
        'location': t.location,
        'specification': t.specification,
        'availableStatus': 'yes' if t.available_status else 'no',
        'about': t.about,
        'image': t.image or '',
        'createdAt': t.created_at.isoformat() if t.created_at else '',
    }


@require_http_methods(["GET"])
def tailor_list(request):
    """
    GET /api/tailors/
    Optional query: ?location=...&specification=...
    """
    qs = Tailor.objects.all()
    location = request.GET.get('location', '').strip()
    specification = request.GET.get('specification', '').strip()
    if location:
        qs = qs.filter(location__icontains=location)
    if specification:
        qs = qs.filter(specification__icontains=specification)
    data = [_tailor_to_dict(t) for t in qs]
    return JsonResponse({'tailors': data})


@require_http_methods(["GET"])
def tailor_detail(request, pk):
    """GET /api/tailors/<id>/"""
    tailor = get_object_or_404(Tailor, pk=pk)
    return JsonResponse(_tailor_to_dict(tailor))


@csrf_exempt
@require_http_methods(["POST"])
def tailor_create(request):
    """
    POST /api/tailors/create/
    Body: { "name", "location", "specification", "availableStatus": "yes"|"no", "about", "image"? }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    name = data.get('name', '').strip()
    if not name:
        return JsonResponse({'error': 'name is required'}, status=400)
    available = data.get('availableStatus', 'yes').lower() not in ('no', 'false', '0')
    tailor = Tailor.objects.create(
        name=name,
        location=data.get('location', '').strip(),
        specification=data.get('specification', '').strip(),
        available_status=available,
        about=data.get('about', '').strip(),
        image=data.get('image', '').strip()[:500],
    )
    return JsonResponse({'ok': True, 'tailor': _tailor_to_dict(tailor)}, status=201)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
def tailor_update(request, pk):
    """
    PUT/PATCH /api/tailors/<id>/
    Body: { "name"? , "location"? , "specification"? , "availableStatus"? , "about"? , "image"? }
    """
    tailor = get_object_or_404(Tailor, pk=pk)
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    if 'name' in data and data['name'] is not None:
        tailor.name = str(data['name']).strip()
    if 'location' in data:
        tailor.location = str(data['location']).strip()
    if 'specification' in data:
        tailor.specification = str(data['specification']).strip()
    if 'availableStatus' in data:
        tailor.available_status = str(data['availableStatus']).lower() not in ('no', 'false', '0')
    if 'about' in data:
        tailor.about = str(data['about']).strip()
    if 'image' in data:
        tailor.image = str(data['image']).strip()[:500]
    tailor.save()
    return JsonResponse({'ok': True, 'tailor': _tailor_to_dict(tailor)})


@csrf_exempt
@require_http_methods(["DELETE"])
def tailor_delete(request, pk):
    """DELETE /api/tailors/<id>/"""
    tailor = get_object_or_404(Tailor, pk=pk)
    tailor.delete()
    return JsonResponse({'ok': True})
