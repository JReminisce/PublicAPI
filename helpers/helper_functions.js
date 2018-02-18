"use strict"
// UTILITY
exports.is_valid_url = (str) => {
  let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
  return regex.test(str)
}
