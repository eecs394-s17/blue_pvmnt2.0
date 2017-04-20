import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { NeoService } from '../services/neo-service';

@Injectable()
export class AuthData {

  neo: NeoService;

  public fireAuth: any;
  public userProfile: any;
  constructor() {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/user/');
    this.neo = new NeoService();
  }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
    
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/user/').child(newUser.uid).set({
        email: email,
        subscriptions: ["northwestern"],
        
      });
      console.log(newUser.uid)
      return this.createUser(newUser.uid);
    });
  }

  createUser(user) {
    var query = 'CREATE (u: User {firebaseId: {userId}}) \
           RETURN u';
    var params = {userId: user};
    return this.neo.runQuery(query, params).then((results) => {
      return results;
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

}