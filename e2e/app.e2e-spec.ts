import { VMSTemplatePage } from './app.po';

describe('VMS App', function() {
  let page: VMSTemplatePage;

  beforeEach(() => {
    page = new VMSTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
