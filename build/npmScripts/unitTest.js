import Jasmine from 'jasmine';
import reporter from 'jasmine-reporters';

let jasmine = new Jasmine();
jasmine.loadConfigFile('./build/templates/spec/jasmine.json');

jasmine.addReporter(new reporter.JUnitXmlReporter({
  savePath: './dist/coverage',
}));

jasmine.execute();
