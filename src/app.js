// imports
const path = require('path');
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({
    databasePath:"./src/DataBase/UserInfos.json"
});
const dburl = new JsonDatabase({
    databasePath:"./src/DataBase/UserUrl.json"
});
const cookieParser = require('cookie-parser');
const { getUser, tokenRefresh } = require('./discord-oauth2/module')

// dotenv
require('dotenv').config({ path: path.join(__dirname, 'authentication', '.env') });
const { PORT } = process.env

// express
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async(req, res) => {
    let user = null
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            user = result.user
        }
    }
    res.render('home/index.ejs', { user });
});
app.get('/dashboard', async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            const id = result.user.id
            const verify = db.get(`${id}`)
            if(verify){
                const info = db.get(`${id}.info`)
                const customize = db.get(`${id}.customize`)
                const links = db.get(`${id}.links`)
                const social = db.get(`${id}.social`)
                res.render('dashboard/index.ejs', {info, customize, links, social});
            }else{
                return res.redirect('/');
            }
            
        }else{
            return res.redirect('/');
        }
    }else{
        return res.redirect('/');
    }
    
    
})
app.get('/:user', async(req, res) => {
    const username = req.params.user;
    const id = dburl.get(`${username}.id`)
    if(id){
        const verify = db.get(`${id}`)
        if(verify){
            const info = db.get(`${id}.info`)
            const customize = db.get(`${id}.customize`)
            const links = db.get(`${id}.links`)
            const social = db.get(`${id}.social`)
            res.render('perfil/index.ejs', { info, customize, links, social });
        }
        else{
            return res.redirect('/');
        }
        
    }else{
        return res.redirect('/');
    }

   
})
app.post('/api/info', async (req, res) => {
    const { username, url, bio } = req.body;
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            const id = result.user.id
            const verify = db.get(`${id}`)
            if(verify){
                try {
                    const infoUrl = db.get(`${id}.info.url`)
                    db.set(`${id}.info.name`, username)
                    db.set(`${id}.info.bio`, bio)

                    if(!infoUrl){
                        const verifyUrl = dburl.get(url)
                        if(!verifyUrl){
                            db.set(`${id}.info.url`, url)
                            dburl.set(`${url}.id`, id)
                        }else{
                            return res.status(500).send('URL já em uso.');
                        }
                        
                    } 
                    return res.status(200).send('foi');
                } catch (error) {
                    
                }
            }else{
                return res.status(500).send('Erro ao processar a solicitação.');
            }
            
        }else{
            return res.status(500).send('Erro ao processar a solicitação.');
        }
    }else{
        return res.status(500).send('Erro ao processar a solicitação.');
    }
});
app.post('/api/customize', async (req, res) => {
    const { avatar, banner } = req.body;
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            const id = result.user.id
            const verify = db.get(`${id}`)
            if(verify){
                try {
                    db.set(`${id}.customize.avatar`, avatar)
                    db.set(`${id}.customize.banner`, banner)
                    return res.status(200).send('foi');
                } catch (error) {
                    return res.status(500).send('Erro ao processar a solicitação.');
                }
            }else{
                return res.status(500).send('Erro ao processar a solicitação.');
            }
            
        }else{
            return res.status(500).send('Erro ao processar a solicitação.');
        }
    }else{
        return res.status(500).send('Erro ao processar a solicitação.');
    }
});
app.post('/api/links', async (req, res) => {
    const { name, url } = req.body;
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            const id = result.user.id
            const verify = db.get(`${id}`)
            if(verify){
                try {
                    db.push(`${id}.links`, { name, url })
                    return res.status(200).send('foi');
                } catch (error) {
                    return res.status(500).send('Erro ao processar a solicitação.');
                }
            }else{
                return res.status(500).send('Erro ao processar a solicitação.');
            }
            
        }else{
            return res.status(500).send('Erro ao processar a solicitação.');
        }
    }else{
        return res.status(500).send('Erro ao processar a solicitação.');
    }
});
app.post('/api/links/remove', async (req, res) => {
    const { name, url } = req.body;
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            const id = result.user.id
            const verify = db.get(`${id}`)
            if(verify){
                try {
                    const urlDB = db.get(`${id}.links`)
                    var newLinks = urlDB.filter(function(link) {
                        return link.name !== name || link.url !== url;
                    });
                    db.set(`${id}.links`, newLinks)
                    return res.status(200).send('foi');
                } catch (error) {
                    return res.status(500).send('Erro ao processar a solicitação.');
                }
            }else{
                return res.status(500).send('Erro ao processar a solicitação.');
            }
            
        }else{
            return res.status(500).send('Erro ao processar a solicitação.');
        }
    }else{
        return res.status(500).send('Erro ao processar a solicitação.');
    }   
});
app.post('/api/social', async (req, res) => {
    const { instagram, twitter, youtube, tiktok, github, telegram } = req.body;
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const result = await tokenRefresh(refreshToken);
        if(result){
            res.cookie('refreshToken', result.token);
            const id = result.user.id
            const verify = db.get(`${id}`)
            if(verify){
                try {
                    if(instagram){
                        db.set(`${id}.social.instagram`, instagram)
                    }else{
                        db.delete(`${id}.social.instagram`)
                    }
                    if(twitter){
                        db.set(`${id}.social.twitter`, twitter)
                    }else{
                        db.delete(`${id}.social.twitter`)
                    }
                    if(youtube){
                        db.set(`${id}.social.youtube`, youtube)
                    }else{
                        db.delete(`${id}.social.youtube`)
                    }
                    if(tiktok){
                        db.set(`${id}.social.tiktok`, tiktok)
                    }else{
                        db.delete(`${id}.social.tiktok`)
                    }
                    if(tiktok){
                        db.set(`${id}.social.github`, github)
                    }else{
                        db.delete(`${id}.social.github`)
                    }
                    if(tiktok){
                        db.set(`${id}.social.telegram`, telegram)
                    }else{
                        db.delete(`${id}.social.telegram`)
                    }
                    return res.status(200).send('foi');
                } catch (error) {
                    return res.status(500).send('Erro ao processar a solicitação.');
                }
            }else{
                return res.status(500).send('Erro ao processar a solicitação.');
            }
            
        }else{
            return res.status(500).send('Erro ao processar a solicitação.');
        }
    }else{
        return res.status(500).send('Erro ao processar a solicitação.');
    }
});
app.get('/api/callback', async (req, res) => {
    const code = req.query.code;
    if(code){
        const result = await getUser(code);
        if(result){
            res.cookie('refreshToken', result.token);
            const verify = db.get(result.user.id)
            if(!verify){
                db.set(result.user.id, {
                    "info": {
                        "name": "",
                        "url": "",
                        "bio": ""
                    },
                    "customize": {
                        "avatar": "",
                        "banner": ""
                    },
                    "links": [],
                    "social": {
                        "instagram": "",
                        "twitter": "",
                        "youtube": "",
                        "tiktok": "",
                        "github": "",
                        "telegram": ""
                    }
                })
            }
            return res.redirect('/dashboard');
        }else{
            console.log('1')
            return res.redirect('/');
        }
    }
    else{
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const result = await tokenRefresh(refreshToken);
            if(result){
                res.cookie('refreshToken', result.token);
                return res.redirect('/dashboard');
            }else{
                console.log('2')
                return res.redirect('/');
            }
        }else{
            console.log('3')
            return res.redirect('/');
        }
        
    }
    
    
})
app.get('/api/logout', async(req, res) => {
    res.clearCookie('refreshToken');
    return res.redirect('/');
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});


