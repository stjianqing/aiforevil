# aiforevil :japanese_ogre:


## Setting up backend 

### Folder Structure
The backend directory contains 3 folders, a requirements.txt file to note down our dependencies and an index.py file for storing our API routes.
The /img folder stores our tiff images from Earth Engine after we have masked the clouds. 
The /sam folder stores our Segmentation module. In it contains the model and the corresponding Class.
The /earthengine folder stores our earthengine module. It stores our cloud masking function and functions to interact with our database.

### Installation
You will need to install ImageMagick from [here.](https://imagemagick.org/archive/binaries/ImageMagick-7.1.1-22-Q16-HDRI-x64-dll.exe) You will also need to download the base Segment-Anything model from [here.](https://dl.fbaipublicfiles.com/segment_anything/sam_vit_l_0b3195.pth)

After installing the two programs above, install dependencies with pip and then run the index.py file in the directory.  
`pip install -r requirements.txt`

`python index.py` 

## Setting up frontend
You will need Node.js and Node Package Manager(NPM). You can install NPM from [here.](https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi)

After that, you should install all dependencies with:
`npm install`

Run the frontend with:
`npm run dev`
