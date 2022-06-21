from atexit import register
from django import views
from django.urls import path, include
from account.views import UserRegistrationView
from account.views import UserLoginView
from account.views import UserProfileView
from account.views import UserChangePasswordView, UserChangePasswordView, SendPasswordResetEmailView
from account.views import UserPasswordResetView , sendAccountEmail
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'), 
    path('login/', UserLoginView.as_view(), name='login'), 
    path('sendemail/',sendAccountEmail), 
    path('profile/', UserProfileView.as_view(), name='profile'), 
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'), 
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'), 
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'), 

   # path ('',views.index,name='index'),
   # path('about',views.about,name='about'),
   # path('contact',views.about,name='contact'),
   # path('login',views.handlelogin,name='handlelogin'),
   # path('signup',views.handlesignup,name='handlesignup'),
]
