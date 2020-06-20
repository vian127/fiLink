export class Method {
  static dateFmt(data) {
    let time;
    if (data > 0) {
      time = new Date(data);
    } else {
      time = new Date();
    }
    const hh = time.getHours() >= 10 ? time.getHours() : `0${time.getHours()}`;
    const mm = time.getMinutes() >= 10 ? time.getMinutes() : `0${time.getMinutes()}`;
    const ss = time.getSeconds() >= 10 ? time.getSeconds() : `0${time.getSeconds()}`;
    return `${hh}:${mm}`;
  }

  static switchLight(item) {
    return item.isSwitchLight === '0' ? '关' : '开';
  }
}
