from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

from django.core.paginator import Paginator
from .serializers import (
    ListSerializer,
    FolderSerializer,
    SharedFolderSerializer,
    RegistrationSerializer,
)
from .models import List, Folder, SharedFolder

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# User registration
class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def AccountDeletionView(request):
    try:
        user = request.user
        user.delete()

    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# User auth
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["username"] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def CheckIfValidUserView(request):
    try:
        email = request.data.get("email", None)
        if User.objects.filter(email=email).count() == 0:
            return Response({"valid": False}, status=status.HTTP_200_OK)

        return Response({"valid": True}, status=status.HTTP_200_OK)

    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


class FolderView(generics.ListCreateAPIView):
    serializer_class = FolderSerializer
    queryset = Folder.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        folders = user.folder_set.order_by("-created_at")

        return Response(
            FolderSerializer(folders, many=True).data,
            status=status.HTTP_200_OK,
        )

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            title = serializer.data.get("title")
            user = request.user
            folder = Folder(title=title, user=user)
            folder.save()
            return Response(
                self.serializer_class(folder).data, status=status.HTTP_201_CREATED
            )
        return Response(status=status.HTTP_400_BAD_REQUEST)


class SharedFolderView(generics.ListAPIView):
    serializer_class = SharedFolderSerializer
    queryset = Folder.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]

    def get(self, request):

        pending_folders = (
            SharedFolder.objects.filter(is_pending=True)
            .filter(shared_user=request.user)
            .select_related("folder")
        )
        shared_folders = (
            SharedFolder.objects.exclude(is_active=False)
            .filter(is_pending=False)
            .filter(shared_user=request.user)
            .select_related("folder")
        )
        sharing_folders = (
            SharedFolder.objects.exclude(is_active=False)
            .filter(is_pending=False)
            .filter(owner=request.user)
            .select_related("folder")
        )

        pending_folder_results = [
            {
                "shared_id": object.id,
                "title": object.folder.title,
                "user": object.folder.user.username,
                "email": object.folder.user.email,
            }
            for object in pending_folders
        ]

        shared_folder_results = [
            {
                "id": object.folder.id,
                "title": object.folder.title,
                "created_at": object.folder.created_at,
                "updated_at": object.folder.updated_at,
                "is_active": object.is_active,
                "user_name": object.owner.username,
                "shared_id": object.id,
            }
            for object in shared_folders
        ]

        sharing_folder_results = [
            {
                "id": object.folder.id,
                "title": object.folder.title,
                "created_at": object.folder.created_at,
                "updated_at": object.folder.updated_at,
                "is_active": object.is_active,
                "user_name": object.shared_user.username,
                "shared_id": object.id,
            }
            for object in sharing_folders
        ]

        return Response(
            {
                "pending_folders": pending_folder_results,
                "shared_folders": shared_folder_results,
                "sharing_folders": sharing_folder_results,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        try:
            folderId = request.data.get("folderId")
            folder = Folder.objects.get(id=folderId)
            email = request.data.get("email")
            user = User.objects.get(email=email)
            owner = request.user
            sharedFolder = SharedFolder(folder=folder, owner=owner, shared_user=user)
            sharedFolder.save()
            return Response(
                self.serializer_class(sharedFolder).data, status=status.HTTP_201_CREATED
            )
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class FolderItemView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FolderSerializer
    queryset = Folder.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            folder = Folder.objects.get(pk=pk)

            if folder.user == request.user:
                folder.delete()
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Folder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(
            FolderSerializer(folder).data, status=status.HTTP_204_NO_CONTENT
        )

    def patch(self, request, pk):
        try:
            folder = Folder.objects.get(pk=pk)
            if request.user != folder.user:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except not folder:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            instance=folder, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(FolderSerializer(folder).data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UpdateShareStatusView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SharedFolderSerializer
    queryset = SharedFolder.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]

    # def delete(self, request, pk):
    #     try:
    #         folder = Folder.objects.get(pk=pk)

    #         if folder.user == request.user:
    #             folder.delete()
    #         else:
    #             return Response(status=status.HTTP_401_UNAUTHORIZED)
    #     except Folder.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
    #     return Response(
    #         FolderSerializer(folder).data, status=status.HTTP_204_NO_CONTENT
    #     )

    def patch(self, request, pk):
        try:
            shared_folder = SharedFolder.objects.get(pk=pk)
            if (
                request.user != shared_folder.owner
                and request.user != shared_folder.shared_user
            ):
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except not shared_folder:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            instance=shared_folder, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                SharedFolderSerializer(shared_folder).data, status=status.HTTP_200_OK
            )

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ListView(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    queryset = List.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        option = request.GET.get("option", "all")
        folder = request.GET.get("folder", "")
        page_number = request.GET.get("page", 1)
        filters = []

        if option == "all":
            filters = Q()
        if option == "done":
            filters = Q(is_done=True)
        if option == "pending":
            filters = Q(is_done=False)
        if folder == "":
            filters.add(Q(folder__isnull=True), Q.AND)
        else:
            filters.add(Q(folder=folder), Q.AND)

        lists = user.list_set.filter(filters).order_by("-created_at")
        paginator = Paginator(lists, 5)
        page_obj = paginator.page(page_number)
        print(paginator.page(page_obj.number).object_list)

        payload = {
            "current": page_obj.number,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "results": self.serializer_class(
                paginator.page(page_obj.number).object_list, many=True
            ).data,
        }

        return Response(
            payload,
            status=status.HTTP_200_OK,
        )

    def post(self, request, format=None):
        user = request.user
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            title = serializer.data.get("title")
            folder = serializer.data.get("folder")
            if not folder:
                listObj = List(title=title, user=user, folder=folderInstance)
                listObj.save()
                return Response(
                    ListSerializer(listObj).data, status=status.HTTP_201_CREATED
                )
            else:
                folderInstance = Folder.objects.get(id=folder)
                sharedFolder = SharedFolder.objects.filter(shared_user=user).filter(
                    folder=folder
                )

                if user == folderInstance.user or len(sharedFolder) != 0:
                    listObj = List(
                        title=title, user=folderInstance.user, folder=folderInstance
                    )
                    listObj.save()
                    return Response(
                        ListSerializer(listObj).data, status=status.HTTP_201_CREATED
                    )
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class SharedListView(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    queryset = List.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        option = request.GET.get("option", "all")
        folder = request.GET.get("folder", "")
        page_number = request.GET.get("page", 1)

        sharedFolder = SharedFolder.objects.filter(shared_user=user).filter(
            folder__id=folder
        )

        if len(sharedFolder) == 0:
            return Response(status=status.HTTP_404_NOT_FOUND)

        filters = []
        if option == "all":
            filters = Q()
        if option == "done":
            filters = Q(is_done=True)
        if option == "pending":
            filters = Q(is_done=False)
        filters.add(Q(folder=folder), Q.AND)

        lists = super().get_queryset().filter(filters)
        paginator = Paginator(lists, 5)
        page_obj = paginator.page(page_number)

        payload = {
            "current": page_obj.number,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "results": self.serializer_class(lists, many=True).data,
        }

        return Response(
            payload,
            status=status.HTTP_200_OK,
        )


class DetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    queryset = List.objects.all()
    permission_classes = [IsAuthenticated]

    # def get(self, request, pk):
    #     try:
    #         list = List.objects.get(pk=pk)
    #     except List.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
    #     return Response(ListSerializer(list).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            user = request.user
            listObj = List.objects.get(pk=pk)
            folder = listObj.folder
            sharedFolder = SharedFolder.objects.filter(shared_user=user).filter(
                folder=folder
            )

            if user == listObj.user or len(sharedFolder) != 0:
                listObj.delete()
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except List.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(ListSerializer(listObj).data, status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        user = request.user
        listObj = List.objects.get(pk=pk)
        serializer = self.serializer_class(
            instance=listObj, data=request.data, partial=True
        )

        if serializer.is_valid():
            print(listObj)
            if not listObj:
                return Response(status=status.HTTP_404_NOT_FOUND)

            folder = listObj.folder
            sharedFolder = SharedFolder.objects.filter(shared_user=user).filter(
                folder=folder
            )
            if user == listObj.user or len(sharedFolder) != 0:
                serializer.save()
                return Response(ListSerializer(listObj).data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        return Response(status=status.HTTP_400_BAD_REQUEST)
