import fs from 'fs'
import path from 'path'
import { execa } from 'execa';

const pkgsPath = path.resolve(__dirname,'../packages')

const dirs = fs.readdirSync(pkgsPath).filter(dir => {
  const stats = fs.statSync(path.resolve(pkgsPath,dir))
  return stats.isDirectory()
})
