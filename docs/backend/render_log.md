2025-10-21T14:06:14.144582419Z ==> Cloning from https://github.com/whoamyi/starrymeet
2025-10-21T14:06:14.842251831Z ==> Checking out commit 72958c38ad3611c44ed2abb233d3e55e8175865e in branch main
2025-10-21T14:06:16.189497113Z ==> Using Node.js version 22.16.0 (default)
2025-10-21T14:06:16.213641631Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-10-21T14:06:18.015881934Z ==> Running build command 'npm install && npm run build'...
2025-10-21T14:06:20.563088172Z 
2025-10-21T14:06:20.563110283Z added 201 packages, and audited 202 packages in 2s
2025-10-21T14:06:20.563120993Z 
2025-10-21T14:06:20.563133503Z 20 packages are looking for funding
2025-10-21T14:06:20.563137253Z   run `npm fund` for details
2025-10-21T14:06:20.567955641Z 
2025-10-21T14:06:20.567964831Z 2 moderate severity vulnerabilities
2025-10-21T14:06:20.567967101Z 
2025-10-21T14:06:20.567969461Z To address all issues (including breaking changes), run:
2025-10-21T14:06:20.567972361Z   npm audit fix --force
2025-10-21T14:06:20.567974351Z 
2025-10-21T14:06:20.567977041Z Run `npm audit` for details.
2025-10-21T14:06:20.71944302Z 
2025-10-21T14:06:20.71946844Z > starrymeet-backend@1.0.0 build
2025-10-21T14:06:20.719471701Z > tsc
2025-10-21T14:06:20.71947379Z 
2025-10-21T14:06:22.766527149Z src/controllers/authController.ts(1,26): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.76654839Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.766676304Z src/controllers/authController.ts(10,67): error TS2339: Property 'body' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.766798777Z src/controllers/authController.ts(62,37): error TS2339: Property 'body' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.766826968Z src/controllers/bookingController.ts(1,26): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.766830577Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.766873149Z src/controllers/bookingController.ts(19,13): error TS2339: Property 'body' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.766963681Z src/controllers/bookingController.ts(126,24): error TS2339: Property 'params' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.766966701Z src/controllers/bookingController.ts(161,52): error TS2339: Property 'query' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.766968921Z src/controllers/bookingController.ts(197,24): error TS2339: Property 'params' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.767074694Z src/controllers/celebrityController.ts(1,35): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767077504Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.7672845Z src/controllers/paymentController.ts(1,35): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.76728756Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.76729161Z src/controllers/paymentController.ts(13,32): error TS2339: Property 'body' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.767341311Z src/middleware/auth.ts(1,49): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767343951Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767348801Z src/middleware/auth.ts(14,28): error TS2339: Property 'headers' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.767381632Z src/middleware/auth.ts(38,28): error TS2339: Property 'headers' does not exist on type 'AuthRequest'.
2025-10-21T14:06:22.767384162Z src/middleware/errorHandler.ts(1,49): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767388262Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767472354Z src/models/User.ts(3,20): error TS7016: Could not find a declaration file for module 'bcrypt'. '/opt/render/project/src/backend/node_modules/bcrypt/bcrypt.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767475325Z   Try `npm i --save-dev @types/bcrypt` if it exists or add a new declaration (.d.ts) file containing `declare module 'bcrypt';`
2025-10-21T14:06:22.767477285Z src/routes/auth.ts(1,24): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767479065Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767518726Z src/routes/bookings.ts(1,24): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767521236Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767533066Z src/routes/celebrities.ts(1,24): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767535006Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767577497Z src/routes/payments.ts(1,24): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767579767Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767583437Z src/server.ts(1,57): error TS7016: Could not find a declaration file for module 'express'. '/opt/render/project/src/backend/node_modules/express/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767585197Z   Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
2025-10-21T14:06:22.767592288Z src/server.ts(2,18): error TS7016: Could not find a declaration file for module 'cors'. '/opt/render/project/src/backend/node_modules/cors/lib/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767594368Z   Try `npm i --save-dev @types/cors` if it exists or add a new declaration (.d.ts) file containing `declare module 'cors';`
2025-10-21T14:06:22.767596088Z src/server.ts(4,20): error TS7016: Could not find a declaration file for module 'morgan'. '/opt/render/project/src/backend/node_modules/morgan/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767597868Z   Try `npm i --save-dev @types/morgan` if it exists or add a new declaration (.d.ts) file containing `declare module 'morgan';`
2025-10-21T14:06:22.767601628Z src/utils/jwt.ts(1,34): error TS7016: Could not find a declaration file for module 'jsonwebtoken'. '/opt/render/project/src/backend/node_modules/jsonwebtoken/index.js' implicitly has an 'any' type.
2025-10-21T14:06:22.767603528Z   Try `npm i --save-dev @types/jsonwebtoken` if it exists or add a new declaration (.d.ts) file containing `declare module 'jsonwebtoken';`
2025-10-21T14:06:22.811108546Z ==> Build failed 😞
2025-10-21T14:06:22.811124057Z ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys