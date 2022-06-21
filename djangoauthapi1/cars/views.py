from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Cars ,Catagories
from .serializers import CarsSerializer ,CatagoriesSerializer , postCarsSerializer
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .pagination import CustomPagination

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([JWTAuthentication])
# def getCar(request):
#     data = Cars.objects.all()
#     serializer = CarsSerializer(data,many=True)
#     print(serializer.data)
#     return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getCarById(request,pk):
    data = Cars.objects.get(id=pk)
    serializer = CarsSerializer(data,many=False)
    print(serializer.data)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def addCar(request):
    serializer = postCarsSerializer(data = request.data)
    print (serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(['PUT'])

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def updateCar(request,pk):
    data = Cars.objects.get(id=pk)
    serializer = postCarsSerializer(instance = data,  partial=True, data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def deleteCar(request,pk):
    data = Cars.objects.get(id=pk)
    serializer = CarsSerializer(data,many=False)
    data.delete()
    return Response(serializer.data)



#categories 

@api_view(['GET'])

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def getCatagory(request):
    data = Catagories.objects.all()
    serializer = CatagoriesSerializer(data,many=True)
    return Response(serializer.data)



@api_view(['POST'])

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def addCatagory(request):
    data = Catagories.objects.all()
    serializer = CatagoriesSerializer(data = request.data)
    print (serializer.is_valid())
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['PUT'])

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def updateCatagory(request,pk):
    data = Catagories.objects.get(id=pk)
    serializer = CatagoriesSerializer(instance = data,  partial=True, data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])

@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def deleteCatagory(request,pk):
    data = Catagories.objects.get(id=pk)
    data.delete() 
    serializer = CatagoriesSerializer(data,many=False)
    return Response(serializer.data)



class getCarsByCatagory(ListAPIView):
    serializer_class = CarsSerializer
    pagination_class = CustomPagination
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get_queryset(self):
        id = self.kwargs['pk']
        queryset = Cars.objects.filter(catagory=id).order_by('-id')
        return queryset





class getCar(ListAPIView):
    serializer_class = CarsSerializer
    pagination_class = CustomPagination
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    def get_queryset(self):
        queryset = Cars.objects.all().order_by('-id')
        return queryset