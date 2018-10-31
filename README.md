# directory

### Remove your current proxies

1. Backup your proxies

   ```
   cp ~/.gitconfig ~/.gitconfig.bak
   cp ~/.nmprc ~/.npmrc.bak
   ```
2. Remove the proxies

   ```
   git config --global --unset http.proxy
   unset http_proxy
   rm -rf ~/.npmrc
   ```
   > to undo these steps, scroll to the bottom of this `README` there is a section for _Restoring proxies_
### Setting up

Before setting up make sure you have removed your current proxies. Follow steps above

1. clone repository

    ```
    https://github.com/geocine/directory.git
    ```
    > you will be prompted for your github credentials
2. install dependencies

    ```
    npm install
    ```
    > make sure you are inside the directory named _"directory"_ before doing an npm install
3. run
    ```
    ng serve --open
    ```
    > `--open` is for automatically opening your browser on port _4200_ http://localhost:4200. any changes made on the code will automatically reload the browser
    
### Building for release

1. Build for release

    ```
    ng build --prod
    ```
    > output will be on the `dist` folder
2. To test locally you must have a local http server like WAMPP etc. Let us use `http-server`

    ```
    npm install -g http-server
    ```
3. Run the `http-server`. Make sure you are inside the _dist_ folder

    ```
    http-server -p <port>
    ```
    > you can substitute `<port>` with anything you like eg. `http-server -p 4200`
 4. Open your browser on the port you chose eg. http://localhost:4200
 
 ### Development
 1. To create a feature checkout `master` branch then create a `feature/<feature>` branch
 
    ```
    git checkout master
    git checkout -b feature/<feature>
    ```
    > you may replace `<feature>` with anything you like eg. `feature/svg-assets`
 2. Commit and push your commits
 
    ```
    git add .
    git commit -m "add svg assets"
    git push -u origin feature/svg-assets
    ```
    > you will not be able to push directly to `master` even if you try to.
 3. Create a pull request against `master`
 
 ### Restoring proxies
 1. Revert back proxy settings
 
    ```
    cp ~/.gitconfig.bak ~/.gitconfig
    cp ~/.nmprc.bak ~/.npmrc
    ```
 ### Running mock API

 1. Install **json-server**
    
    ```
    npm install -g ./lib/json-server-0.12.1.tgz
    ```
    > only need to this once , no need to install if already installed
 2. Run the mock api server

    ```
    npm run api
    ```
