import * as React from 'react';
import * as classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, List, Typography, Divider, IconButton, Paper } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import { IMenuBarProps, IMenuItems, IMenuBarState } from './IMenuBar';
import { menuBarStyles } from './menuBar.styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { menuItems } from './menuItems';
import { labels } from '../../../utils/app.constants';

class MenuBar extends React.Component<IMenuBarProps, IMenuBarState> {
  constructor(props: IMenuBarProps) {
    super(props);
    this.state = {
      navigationMenuItems: menuItems,
    };
  }

  public handleMenuClick(menu: IMenuItems, index: number): void {
    if (menu.children && menu.children.length > 0) {
      const isMenuOpen = this.state.navigationMenuItems[index].isOpen;
      this.state.navigationMenuItems[index].isOpen = !isMenuOpen;
    } else {
      this.state.navigationMenuItems.forEach(menuItem => {
        menuItem.isOpen = false;
      });
    }
    this.forceUpdate();
  }

  public renderNavigationMenu(): React.ReactElement<any> {
    const { navigationMenuItems } = this.state;

    return (
      <List>
        <div style={{margin: 5}}>
          {navigationMenuItems && navigationMenuItems.map((menu, index) => this.renderMenuItem(menu, index))}
        </div>
      </List>
    );
  }

  public renderMenuItem(menu: IMenuItems, index: number): React.ReactElement<any> {
    const { classes, isMenuBarOpen } = this.props;
    const menuItem = (
      <Paper>
        <ListItem
          button
          className={classNames(classes.menuItem, menu.isOpen && classes.selectedMenu)}
          onClick={() => this.handleMenuClick(menu, index)}
        >
          <ListItemIcon className={classes.icon}>{menu.icon}</ListItemIcon>
          <ListItemText className={classNames(classes.title, !isMenuBarOpen && classes.displayNone )} primary={menu.title} />
          {menu.children && isMenuBarOpen && (menu.isOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
      </Paper>
    );

    if (menu.children) {
      return (
        <div key={`menu_${menu.id}`}>
          {menuItem}
          <Collapse in={menu.isOpen} timeout='auto' unmountOnExit>
            <List component='div' disablePadding className={classes.nestedMenuList}>
              {this.renderNestedMenuItems(menu.children)}
            </List>
          </Collapse>
        </div>
      );
    } else {
      return (
        <NavLink to={menu.path} activeClassName={classes.navigation} key={`menu_${menu.id}`}>
          {menuItem}
        </NavLink>
      );
    }
  }

  public renderNestedMenuItems(nestedMenuItems: IMenuItems[]): any {
    const { classes, isMenuBarOpen } = this.props;

    return nestedMenuItems.map(menu => (
      <NavLink to={menu.path} activeClassName={classes.navigation} key={`nested_menu_${menu.id}`}>
        <Paper>
          <ListItem button className={classNames(classes.nestedMenuItem, isMenuBarOpen && classes.nestedMenuItemAlignment)}>
            <ListItemIcon className={classes.icon}>{menu.icon}</ListItemIcon>
            <ListItemText className={classNames(classes.title, !isMenuBarOpen && classes.displayNone )} inset primary={menu.title} />
          </ListItem>
        </Paper>
      </NavLink>
    ));
  }

  public render(): React.ReactElement<MenuBar> {
    const { classes, theme, isMenuBarOpen, toggleMenuBar } = this.props;

    return (
      <Drawer
        variant='permanent'
        classes={{
          paper: classNames(classes.menuBar, !isMenuBarOpen && classes.menuBarClose),
        }}
        open={isMenuBarOpen}
      >
        <div className={classes.toolbar}>
          <Typography variant='title' color='primary' noWrap>
            {labels.appTitle}
          </Typography>
          <IconButton onClick={() => toggleMenuBar()}>
            {theme && theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        {this.renderNavigationMenu()}
        <Divider />
      </Drawer>
    );
  }
}

export default withStyles(menuBarStyles, { withTheme: true })(MenuBar);
