---
title: Authentication
---

Ketos provides a simple user authentication system, which may be disabled by configuration.

When disabled, all users have access to all functionality. This is typically used for standalone instances. This is also the default configuration. 

The purpose of the authentication, at this stage, is simply to support three distinct classes of user group:

* User: a standard user who can access all the datasets.      
* Administrator: a user who is a manager of the system in additional and thus has additional functionality available to them to oversee this.
* Developer: a developer of plugins which offers some additional system plugins which are not useful to standard users

The server plugins are responsible for checking that a user has appropriate role and permissions. The application filters the plugins to only those which the user can see, as well as offer the user the ability to log in (if authentication is enabled).

## Configuration

The authentication configuration is enabled through Spring profiles. These are usually set in the `application.yaml`

```yaml
spring:
    profiles: 
        include:
        -  auth-none
```

Here the `auth-none` profile is enabled. If no auth profile is listed then `auth-none` is applied, and no authentication is used.

The available authentication types are:

* `auth-none`: Disables authentication, the default. All users to the system have open access to user, adminstrator and developer functionality. 
* `auth-jpa`:  Use Spring Data JPA backed source for authentication
* `auth-mongo`: Use Spring Data Mongo backed repository for authentication
* `auth-mem`: Use an in memory, transient(!) implementation. This is useful for development.

The implementations are storage options only. The same password hashing, user verification, and  sessions management logic is applied in all cases. 

The authenticating profiles (`-jpa`, `-mongo`) perform a check on startup to ensure that an admin user exists. If an admin user does not exist one is generated, and the password **logged** via the configured logging mechanism (usually to the console). **The administrator should change the password from this immediately.** 

The `auth-mem` implementation creates a user, developer and adminstrator on start up. Any changes to their password, creation or deletion of users, etc are lost when the application is stop and restarted. The passwords are the same as s the user names (`user`, `dev`, `admin`). 

## Extension

As with the rest of the application the authentication system is a module which can be replaced with something tailored to the needs of the environment, for example, single sign on.