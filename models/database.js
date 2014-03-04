var mysql = require('mysql');
var config = require('../config');

// ModelBase: Modelのベースクラス
var Database = function () {};

// データベースの認証情報を格納する
Database.prototype.dbAuth = config.databaseAuth;

// MySQLクライアントオブジェクトを作成する
Database.prototype._getClient = function () {
  if (this.client == undefined) {
    this.client = mysql.createConnection(this.dbAuth);
  }
  
  return this.client;
};

// クエリを実行する
Database.prototype.query = function (query, params, callback) {
  var client = this._getClient();
  return client.query(query, params, callback);
}

// クエリを終了する
Database.prototype.end = function (callback) {
  if (this.client) {
    this.client.end(callback);
    delete this.client;
  }
}

// Databaseのクラスのインスタンスを作成する
function createClient () {
  return new Database();
} 

exports.createClient = createClient;

