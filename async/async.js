/*
* 同步：程序（进程/线程）在任务的处理过程中，不会插入处理其他任务，即使遇到IO等不占CPU的操作，也会一直等待其结束再往下处理
*
* 异步：程序（进程/线程）在任务的处理过程中，会插入处理其他任务，如果遇到IO操作，当前任务会将程序（进/线）的控制权释放给其他任务
*  等IO操作结果返回后再继续往下处理。
*
* 任务说明：Jay.txt、Angela.txt、Henry.txt 依次读取并打印
*/

const fs = require('fs');
const readFilePromise = require('fs-readfile-promise');
const co = require('co');


/*
* 回调函数
*/
function callBack(){
  fs.readFile('Jay.txt', 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
    fs.readFile('Angela.txt', 'utf8', function (err, data) {
      if (err) throw err;
      console.log(data);
      fs.readFile('Henry.txt', 'utf8', function (err, data) {
        if (err) throw err;
        console.log(data);
      });
    });
  });
  console.log("finish");
}

/*
* 串行和并行
*
* 串行：做完一个才能做下一个
*
* 并行：多个任务可以同时做
*
*
*/

function exTwo() {
  fs.readFile('Jay.txt', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  fs.readFile('Angela.txt', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  fs.readFile('Henry.txt', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  console.log("finish");
}


/**
 * promise
 * promise对象能够表示一个异步操作结果的状态和结果，使其提供的.then()方法可以将多个异步操作“串联起来”
 * .then()方法本身也返回一个promise对象.
 *
 */

function promiseOne() {
  readFilePromise('Jay.txt', 'utf8')
    .then(function(data) {
      console.log(data);
    })
    .then(function() {
      return readFilePromise('Angela.txt', 'utf8');
    })
    .then(function(data) {
      console.log(data);
    })
    .then(function() {
      return readFilePromise('Henry.txt', 'utf8');
    })
    .then(function(data) {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });
  console.log("finish");
}

/**
 * Generator 函数
 *
 * function*
 *
 */
function generatorOne() {
  function* generator(){
    yield readFilePromise('Jay.txt','utf8');
    yield readFilePromise('Angela.txt','utf8');
    yield readFilePromise('Henry.txt','utf8');
  }

  let gen = generator();
  gen.next().value.then((data)=>{
    console.log(data);
    gen.next().value.then((data)=>{
      console.log(data);
      gen.next().value.then((data)=>{
        console.log(data);
        console.log(gen.next());
      });
    });
  });
  console.log("finish");
}

/**
 * co
 *
 */
function coOne(){
  // generator()是一个生成器函数
  function* generator() {
    let data = yield readFilePromise('Jay.txt', 'utf8');
    console.log(data);
    data = yield readFilePromise('Angela.txt', 'utf8');
    console.log(data);
    data = yield readFilePromise('Henry.txt', 'utf8');
    console.log(data);
  }
  let gen = generator(); // gen是一个生成器对象
  co(generator()).then(function() {
    console.log('Generator function is finished!');
  });
  console.log("finish");
}

/*
* async
*
*/
// console.log(readFilePromise('Jay.txt', 'utf8'));
function asyncOne() {
  async function asyncReadFile() {
    let data = await readFilePromise('Jay.txt', 'utf8');
    console.log(data);
    data = await readFilePromise('Angela.txt', 'utf8');
    console.log(data);
    data = await readFilePromise('Henry.txt', 'utf8');
    console.log(data);
    return "Async function is finished!"
  }
  asyncReadFile().then(function(data) {
    console.log(data);
  });
  console.log("finish");
}
asyncOne();






