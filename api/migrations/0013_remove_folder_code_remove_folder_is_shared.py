# Generated by Django 4.0.4 on 2022-06-01 00:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_rename_is_accepted_sharedfolder_is_active_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='folder',
            name='code',
        ),
        migrations.RemoveField(
            model_name='folder',
            name='is_shared',
        ),
    ]
