#### Setup

1. Install firebase-tools

   npm install -g firebase-tools

2. Log in with your firebase account with:

   firebase login

3. Initialize your project. You can create new project via cli or point to existing project if your local setup is aligned with your created firebase project, else you won't see your project in the cli.

   firebase init

4. Install dev dependencies

   npm install --save express body-parser firebase-functions-helper

5. Write your functions

6. Setup deployment in firebase.json

7. Deploy with:

    firebase deploy

8. Deploy only functions if theres changes in routing.

    firebase deploy --only functions

9. Test your rest with postman