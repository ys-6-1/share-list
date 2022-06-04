from django.contrib import admin

# Register your models here.
from .models import List, Folder, SharedFolder

admin.site.register(List)
admin.site.register(Folder)
admin.site.register(SharedFolder)
