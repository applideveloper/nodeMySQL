// Copyright (c) 2012, Hiromichi Matsushima <hylom@users.sourceforge.jp>
// All rights reserved.
// This file is released under New BSD License.

var database = require('./database');
var db = database.createClient();
var stories = exports;

// 記事を新規作成する
stories.insert = function (story, callback) {
  var params = [
    story.slug,
    story.title,
    story.body
  ];

  db.query(
    'INSERT INTO stories '
    + '(sid, slug, title, body, cdate) '
    + 'VALUES '
    + '(NULL, ?,  ?,  ?,  NOW())'
    + ';',
  params,
  function (err, results, fields) {
    db.end();
    var sid = results.insertId;
    if (err) {
      callback(new Error('Insert failed.'));
      return;
    }
    
    callback(null);
  });
}

// sidを指定してデータベースから記事を取得する
stories.getBySid = function (sid, callback) {
  db.query(
    'SELECT * FROM stories WHERE sid = ?;',[sid],
    function (err, results, fields) {
      db.end();
      if (err) {
        callback(err);
        return;
      }
      
      if (results && (results.length > 0)) {
        var story = new Story(results[0]);
        callback(null, story);
        return;
      }
      
      callback(null, null);
    }
  );
}

// slugを指定してデーターベースから記事を取得する
stories.getBySlug = function (slug, callback) {
  db.query(
    'SELECT * FROM stories WHERE slug = ?;',[slug,],
    function (err, results, fields) {
      db.end();
      if (err) {
        callback(err);
        return;
      }

      if (results && (result.length > 0)) {
        callback(null, result[0]);
        return;
      }
      
      callback(null, null);
    }
  );
}

// 最新n件の記事を取得する
stories.getLatest = function (count, skip, callback) {
  // skip引数はオプションなので省略可能
  if ('function' === typeof skip) {
    callback = skip;
    skip = undefined;
  }

  skip = skip | 0;
  db.query(
    'SELECT * FROM stories ORDER BY cdate DESC LIMIT ?, ?;', [skip, count],
    function(err, results, fields) {
      db.end();
      if (err) {
        callback(err);
        return;
      }  
  
      callback(null, results);
    }
  );
};
