# Generated by Django 4.0.4 on 2022-05-28 00:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_folder_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]