# Generated by Django 4.0.4 on 2022-05-30 05:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_sharedfolder'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='is_shared',
            field=models.BooleanField(default=False),
        ),
    ]