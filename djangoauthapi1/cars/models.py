
from django.db import models

class Catagories(models.Model):
    name = models.CharField(max_length=50,null=True,blank=True)
    def __str__(self):
        return self.name


class Cars(models.Model):
    catagory = models.ForeignKey(Catagories,on_delete=models.CASCADE, null=True,blank=True)
    model = models.CharField(max_length=50,null=True,blank=True)
    color = models.CharField(max_length=50,null=True,blank=True)
    registrationNo = models.CharField(max_length=50,null=True,blank=True)
    def __str__(self):
        return str(self.model)