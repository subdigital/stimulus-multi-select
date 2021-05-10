import { Application } from 'stimulus'
import MultiSelectController from "../../src/index"

const application = Application.start()
application.register('multi-select', MultiSelectController)