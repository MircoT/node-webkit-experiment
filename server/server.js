var _ = require("underscore"),
    express = require('express'),
    logfmt = require("logfmt"),
    request = require('request'),
    cheerio = require('cheerio');

_.str = require('underscore.string');
_.mixin(_.str.exports());

SCOREBOARD = {};

TOKEN_AWARD = {
    "1": 20,
    "2": 10,
    "3": 5
};

PARTIAL_TOKEN_AWARD = {};

TOKEN_BONUS = {
    "node-webkit": 9999,
    "javascript": 9999,
    "nodejs": 9999,
    "link": 5000,
    "webapp": 5000,
    "Blink": 10000,
    "Gecko": 10000,
    "GNOME": 10000,
    "KDE": 10000,
    "Scala": 10000,
    "dart": 90000,
    "emscripten": 90000,
    "SpiderMonkey": 100000,
    "V8": 100000,
    "HTML5": 5000,
    "CSS3": 5000,
    "JS": 5000,
    "WebGL": 5000,
    "Mac": 5000,
    "Linux": 5000,
    "Windows": 5000,

};

TOKEN_BONUS_AWARDS = {
    "node-webkit": 3,
    "javascript": 3,
    "nodejs": 3,
    "link": 1,
    "webapp": 3,
    "Blink": 3,
    "Gecko": 3,
    "GNOME": 1,
    "KDE": 1,
    "Scala": 1,
    "dart": 1,
    "emscripten": 1,
    "SpiderMonkey": 2,
    "V8": 2,
    "HTML5": 1,
    "CSS3": 1,
    "JS": 1,
    "WebGL": 2,
    "Mac": 1,
    "Linux": 1,
    "Windows": 1,
};

function task(callback, qs, scores, key){
    return function request_task(){
        var options = {
            url: 'https://www.google.com/search',
            method: 'GET',
            qs: {'q': qs}
        };
        request(
            options,
            (function(data, key){
                return function (error, response, html){
                    if (!error && response.statusCode == 200) {
                        $ = cheerio.load(html);
                        result = $("#resultStats").text();
                        result = result.replace("About", "");
                        result = result.replace("results", "");
                        result = result.replace(/\,/g, "");
                        result = parseInt(_.str.trim(result));
                        data[key] = result;
                        callback();
                    }
                };
            })(scores, key)
        );
    };
}

function get_ordered_results(){
    var results = {};
    _.each(
        SCOREBOARD,
        function(value, key, list){
            if(!_.has(results, value)){
                results[value] = [];
            }
            results[value].push(key);
        }
    );
    results = _.zip(
        _.range(1, _.keys(results).length + 1),
        _.sortBy(_.pairs(results), function(elm){ return parseInt(elm[0]);}).reverse()  // example elm: [ '11', [ 'test2' ] ]
    );
    return results;
}

function choice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

TOKEN_ANSWERS = [
    "Invalid token, you have not incremented your record...",
    "Why do you think this is a token?",
    "You're kidding, right?",
    "Be serious, please...",
    "Not a token, bye!",
    "Do you want make only suggestions or you can also find a token?"
];

SCORES_ANSWERS = [
    "You can do better, try again...",
    "Nice shot, far from the target!",
    "Any plan B?",
    "You're committing only errors...",
    "Take a deep breath and change words...",
    "Take your time, but time never waits you! :P",
    "Take a break and go out for a walk, is better!",
    "What a shame... you failed..."
];

END_ANSWERS = [
    "Challenge is over...",
    "Please stop to bother me!",
    "I don't like what you are sending me.",
    "I don't want to respond...",
    "We are not at home and we will contact you soon..."
];

CHALLENGE_COMPLETED = false;
LAST_ACTION = "";

// Express Application
var app = express();

app.use(logfmt.requestLogger());

// http://enable-cors.org/server_expressjs.html
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use('/', express.static(__dirname + '/'));

app.get('/last', function(req, res){  
    res.json({'last': LAST_ACTION});
});

app.get('/app', function(req, res){  
    res.download("app.nw");
});

app.get('/osx_app', function(req, res){  
    res.download("osx_app.zip");
});

app.get('/windows_app', function(req, res){  
    res.download("windows_app.zip");
});

app.get('/endchallenge', function(req, res){  
    CHALLENGE_COMPLETED = true;
    res.json({"status": "executed"});
});

app.get('/scoreboard', function(req, res){ 
    if(CHALLENGE_COMPLETED){
        var results = get_ordered_results();
        var final_results = [];
        _.each(
            results,
            function(elm, index, list){
                var pos = elm[0],
                    points = elm[1][0],
                    users = elm[1][1];
                _.each(
                    users,
                    function(name, index, list){
                        // Name, points,
                        var tokens = (_.has(TOKEN_BONUS_AWARDS, name)) ? TOKEN_BONUS_AWARDS[name] : 0;
                        var partial_tokens = (_.has(PARTIAL_TOKEN_AWARD, name)) ? PARTIAL_TOKEN_AWARD[name] : 0;
                        tokens = tokens + Math.floor(partial_tokens / 2) ;
                        tokens = (_.has(TOKEN_AWARD, pos)) ? tokens + Math.ceil(TOKEN_AWARD[pos] / users.length) : tokens;
                        final_results.push([name, points, tokens]);
                    }
                );
            }
        );
        res.json(
            {
                "final_scores": _.sortBy(final_results, function(elm){ return parseInt(elm[2]); }).reverse()
            }
        );
    }
    else{
        res.json(
            {
                "challenge_scoreboard": get_ordered_results()
            }
        );
    }
});

app.get('/submit', function(req, res){
    if(CHALLENGE_COMPLETED) res.json(400, {'error': choice(END_ANSWERS)});
    var name, result;
    if(!_.has(req.query, 'name')) res.json(400, {'error': "No name specified!"});
    else name = req.query.name;
    
    if(_.keys(req.query).length === 2 && _.has(req.query, 'token')){
        if(_.has(TOKEN_BONUS, req.query.token)){
            if(!_.has(SCOREBOARD, name)){
                SCOREBOARD[name] = TOKEN_BONUS[req.query.token];
                if(!_.has(TOKEN_BONUS_AWARDS, name)) TOKEN_BONUS_AWARDS[name] = 0;
                TOKEN_BONUS_AWARDS[name] += TOKEN_BONUS_AWARDS[req.query.token];
                delete TOKEN_BONUS[req.query.token];
                LAST_ACTION = name + " has found " + req.query.token;
                res.json(
                    {
                        "message": "You didn't have a score, so this token will burn with you...",
                        "your_score": SCOREBOARD[name]
                    }
                );
            }
            else{
                SCOREBOARD[name] += TOKEN_BONUS[req.query.token];
                if(!_.has(TOKEN_BONUS_AWARDS, name)) TOKEN_BONUS_AWARDS[name] = 0;
                TOKEN_BONUS_AWARDS[name] += TOKEN_BONUS_AWARDS[req.query.token];
                delete TOKEN_BONUS[req.query.token];
                LAST_ACTION = name + " has found " + req.query.token;
                res.json(
                    {
                        "message": "You have incremented your score and burned a token, congratulations!",
                        "your_score": SCOREBOARD[name]
                    }
                );
            }
        }
        else{
            res.json(
                {
                    "message": choice(TOKEN_ANSWERS),
                    "your_score": SCOREBOARD[name]
                }
            );
        }
    }
    else if(_.keys(req.query).length === 3 && _.has(req.query, 'word1') && _.has(req.query, 'word2')){
        var scores = {
            'or_word1': 0,
            'or_word2': 0,
            'word1': 0,
            'word2': 0
        };
        if(req.query.word1.split(" ").length != 1 || req.query.word2.split(" ").length != 1 ){
            res.json(400, {'error': "You can pass a token or a couble of words (word1 and word2) as parameters!"});
            return;
        }
        else if(req.query.word1 === req.query.word2){
            res.json(400, {'error': "word 1 and word 2 must be different!"});
            return;
        }
        var final_score = 
            (function(scores, name, res){
                return function(){
                    var ratio = (scores.word1 >= scores.word2) ? Math.abs(scores.word1 / scores.word2) : Math.abs(scores.word2 / scores.word1);
                    var avg = (scores.or_word1 + scores.or_word2) / 2;
                    var new_score = parseInt(avg / ratio);
                    if(_.isNaN(new_score)) new_score = 0;  // Same word
                    if(_.has(SCOREBOARD, name) && new_score > SCOREBOARD[name]){
                        SCOREBOARD[name] = new_score;
                        if(!_.has(PARTIAL_TOKEN_AWARD, name)) PARTIAL_TOKEN_AWARD[name] = 0;
                        PARTIAL_TOKEN_AWARD[name] += 1;
                        LAST_ACTION = name + " beat his/her previous score";
                        res.json(
                            {
                                "message": "You beat your previous record!!!",
                                "your_score": new_score
                            }
                        );
                    }
                    else if(!_.has(SCOREBOARD, name)){
                        SCOREBOARD[name] = new_score;
                        res.json(
                            {
                                "message": "This is your first score, congratulations!",
                                "your_score": new_score
                            }
                        );
                    }
                    else{
                        res.json(
                            {
                                "message": choice(SCORES_ANSWERS),
                                "your_score": new_score
                            }
                        );
                    }
                };
            })(scores, name, res);
        var task_word2 = task(
            final_score,
            req.query.word2.concat(" -").concat(req.query.word1),
            scores,
            'word2'
        );
        var task_word1 = task(
            task_word2,
            req.query.word1.concat(" -").concat(req.query.word2),
            scores,
            'word1'
        );
        var or_word2 = task(
            task_word1,
            req.query.word2.concat(" OR ").concat(req.query.word1),
            scores,
            'or_word2'
        );
        task(
            or_word2,
            req.query.word1.concat(" OR ").concat(req.query.word2),
            scores,
            'or_word1'
        )();
    }
    else res.json(400, {'error': "You can pass a token or a couble of words (word1 and word2) as parameters!"});
});

var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
    console.log('Listening on %d', server.address().port);
});