from django.contrib import admin
from django.urls import path
from .views import (
    ListView,
    DetailsView,
    FolderView,
    FolderItemView,
    SharedFolderView,
    SharedListView,
    CheckIfValidUserView,
    UpdateShareStatusView,
)

urlpatterns = [
    path("folders", FolderView.as_view()),
    path("folders/<int:pk>", FolderItemView.as_view()),
    path("shared_folders", SharedFolderView.as_view()),
    path("shared_folders/<int:pk>", UpdateShareStatusView.as_view()),
    path("items", ListView.as_view()),
    path("items/<int:pk>/", DetailsView.as_view()),
    path("shared_items", SharedListView.as_view()),
    path("valid_users", CheckIfValidUserView),
]
