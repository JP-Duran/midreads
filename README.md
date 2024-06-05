# midreads

### [Final Presentation Link](https://docs.google.com/presentation/d/1P2gFYvK11ksNucLE_lk21sIDmIObrJyEow4Cefbmijs/edit?usp=sharing)

### Project Blurb

Midreads is a platform for book lovers. Our customers can use our platform to find new books to read, searching from our library of over 10,000 popular titles. Page counts and ratings are included to help our users find what they will love. Users can also add to their 'read later' list, rate books they have read, and add books to their personal library. When you create an account with Midreads, you can customise your profile with a bio and a profile picture, and connect with your friends to view their profiles. We have a simple, clean design, and designed our website to be easy to use and easy to learn.

### [UI Prototype Link](https://www.figma.com/design/06Grid7QpstABdzwhMFVan/Midreads-Homepage?node-id=0-1&t=2CPF7OGMEoiFyQFE-1)

#### Prototype last updated 12 May 2024

#### _Development environment setup goes here_

### [UML Wiki Page](https://github.com/JP-Duran/midreads/blob/main/docs/uml.md)

## Contributing

We welcome contributions from our fans. Please follow these guidelines when contributing to this project:

### Coding Standards

- **JavaScript/React**: We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- **CSS**: Follow the [BEM (Block Element Modifier) methodology](http://getbem.com/introduction/).
- **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clear and consistent commit messages.

### Style Guide

Please adhere to the following style guides:

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [BEM CSS Naming Conventions](http://getbem.com/naming/)

### Setting Up Your Development Environment

To ensure code quality and consistency, we recommend setting up the following IDE plugins:

#### Visual Studio Code

1. **ESLint**: Provides real-time linting for JavaScript/React code.

   - Install the ESLint plugin from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
   - Create or update your `.vscode/settings.json` file to include:
     ```json
     {
       "eslint.validate": [
         "javascript",
         "javascriptreact",
         "typescript",
         "typescriptreact"
       ],
       "editor.codeActionsOnSave": {
         "source.fixAll.eslint": true
       }
     }
     ```

2. **Prettier**: Ensures consistent code formatting.

   - Install the Prettier plugin from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
   - Create or update your `.vscode/settings.json` file to include:
     ```json
     {
       "editor.formatOnSave": true,
       "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
     ```

3. **Stylelint**: Lints CSS/Sass/Less.
   - Install the Stylelint plugin from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint).
   - Ensure you have a `.stylelintrc` configuration file in your project root.

### Running Lint and Tests

Before submitting a pull request, please ensure that your code passes all linting and tests. You can run the following commands:

```sh
# Run ESLint
npm run lint

# Run Prettier
npm run prettier:check

# Run Stylelint
npm run stylelint

# Run Tests
npm test
```

For the avid reader who wants a virtual library of their reading history, midreads is a website that allows readers to log their books they've read and want to read, rate the books they've read, and see what their friends are reading. Unlike GoodReads, our product is simple to use and doesn't sell user data.

**Julian Duran**
As a new user I want to create an account so I can login later.  
As a returning user I want to login to my account so I can access my data.  
As a new user I want to have my own account so I can keep track of my own personal data.  
**Kylan O'Connor**  
As a user I want to logout of my account so I can leave my computer safely.  
As a concerned user I want to change my password so I can maintain my security.  
As a user I want to search for a book so I can see if midreads has it.  
**Ethan Emery**  
As a user I want to add a new book to midreads database so I can then interact with it on the website.  
As a user I want to add a book to my completed-list so I can track what I've read.  
As a user I want to remove a book from my completed-list in case I made a mistake adding it.  
**Sean Wagoner**  
As a user I want to add a book to my backlog so I can remember to read it later.  
As a user I want to remove a book from my backlog if I don't want to read it anymore.  
As a user I want to transfer a book from my backlog to my completed-list so I can keep track of what I've read.  
**Cole Costa**  
As a user I want to rate a book so that midreads knows my preferences.  
As a social user I want to search for other users profiles so I can find my friends.  
As a user I want to view other users profiles so I can compare myself to them.  
**Colby Watts**  
As a user I want to view my own profile so I can see my information.  
As a security-conscious user I don't want other users to be able to edit my profile so I can maintain my own data.  
As a disgruntled user I want to delete my own account so I can control my own data.
