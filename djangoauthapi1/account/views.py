from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import UserLoginSerializer, UserRegistrationSerializer,UserProfileSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import User
from rest_framework.permissions import IsAuthenticated

from account.serializers import UserChangePasswordSerializer
from account.serializers import SendPasswordResetEmailSerializer
from account.serializers import UserPasswordResetSerializer


from django.core.mail import EmailMessage
from django.template import Context
from django.template.loader import get_template
from djangoauthapi1.settings import EMAIL_HOST_USER
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication




def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
 
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post (self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response ({'token':token, 'msg':'Registration Successfull'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post (self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user=authenticate(email =email, password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response ({'token':token,'msg':'Login Successfull'},status=status.HTTP_200_OK)
            else:
                return Response ({'errors':{'non_field_errors':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    renderer_classes =[UserRenderer]
    permission_classes = [IsAuthenticated]
    def get (self,request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response (serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post (self,request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context ={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response ({'msg':'Password Changed Successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post (self,request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response ({'msg':'Password Reset link send. Please check your Email'},status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post (self,request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context ={'uid':uid,'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response ({'msg':'Password Reset Successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def sendAccountEmail(request):

    if request.method == 'POST':

        data = request.data

        message = get_template(
            "emails/sendAccountInformation.html").render({"data": data})

        mail = EmailMessage(
            subject="Account Created",
            body=message,
            from_email=EMAIL_HOST_USER,
            to=[data["email"]],
            reply_to=[EMAIL_HOST_USER],
        )
        mail.content_subtype = "html"
        mail.send()
        return Response(status=status.HTTP_201_CREATED)