from rest_framework import serializers
from .models import Folder, List, SharedFolder
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ["id", "title", "created_at", "updated_at", "user"]


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = [
            "id",
            "title",
            "created_at",
            "updated_at",
            "is_done",
            "user",
            "folder",
        ]


class SharedFolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFolder
        fields = [
            "id",
            "folder",
            "owner",
            "created_at",
            "updated_at",
            "is_pending",
            "is_active",
            "shared_user",
        ]


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        # validators=[validate_password]
    )
    password2 = serializers.CharField(
        style={"input-type": "password"}, write_only=True, required=True
    )

    class Meta:
        model = User
        fields = ["email", "username", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"], email=validated_data["email"]
        )

        user.set_password(validated_data["password"])
        user.save()

        return user
