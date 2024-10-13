const {User, Token, Rights} = require('../models');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const {Op} = require('sequelize');


class UserService {
    async registration(body) {
        const candidate = await User.findOne({
            where: {
                email: body.email
            }
        })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${body.email} уже существует`)
        }
        const password = await bcrypt.hash(body.password, 10);
        const result = await User.create({...body, password})
        const rights = this.giveRights(body.role)
        rights.forEach(async right => {
            const userData = await User.findOne({where: {id: result.id}})
            const rightResult = await Rights.create({...right})
            rightResult.setUser(userData)
        })
        return {user: result.id}
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}, include: [Rights]})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const {
            email: userEmail,
            name,
            speciality,
            phone,
            role,
            isDeletedPlace,
            Rights: rights,
            urlSignPath,
            signFileName
        } = user
        const userDto = new UserDto({email: user.email, id: user.id, isActivated: true});
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                email: userEmail,
                urlSignPath,
                signFileName,
                name,
                speciality,
                phone,
                role,
                isDeletedPlace,
                rights: rights.length > 0 ? rights : [{
                    entity: 'applications',
                    create: false,
                    update: false,
                    read: true,
                    delete: false
                }, {
                    entity: 'users',
                    create: false,
                    update: false,
                    read: false,
                    delete: false
                }, {entity: 'checkupPlanPlace', create: false, update: false, read: false, delete: false},{
                    entity: 'smetas',
                    create: false,
                    update: false,
                    read: false,
                    delete: false
                }],
            }
        }
    }

    async logout(refreshToken) {
       return  await tokenService.removeToken(refreshToken);

    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await Token.findOne({where: {refreshToken}});
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findOne({where: {id: userData.id}, include: [Rights]});
        const {
            id,
            email: userEmail,
            name,
            speciality,
            phone,
            role,
            isDeletedPlace,
            Rights: rights,
            urlSignPath,
            signFileName
        } = user
        const userDto = new UserDto({email: user.email, id, isActivated: true});
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(user, tokens.refreshToken);
        return {
            ...tokens,
            user: {
                id,
                email: userEmail,
                urlSignPath,
                signFileName,
                name,
                speciality,
                phone,
                role,
                isDeletedPlace,
                rights
            }
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({include: [Rights]});
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getByLetter(req, res, next) {
        try {
            const {page, limit, email, name, speciality, phone} = req.query;
            const offset = page * limit - limit
            const userdata = await User.findAndCountAll({
                where: {
                    email: {[Op.like]: `%${email}%`},
                    name: {[Op.like]: `%${name}%`},
                    speciality: {[Op.like]: `%${speciality}%`},
                    phone: {[Op.like]: `%${phone}%`},
                }, limit, offset
            });
            return res.json(userdata);
        } catch (e) {
            next(e);
        }
    }

    async checkIsSuperAdmin() {
        const user = await User.findOne({where: {role: 'superadmin'}});
        return user.role
    }

    async changeIsDeleted(email) {
        const user = await User.findOne({where: {email}})
        const {email: userEmail, name, speciality, phone, role, isDeletedPlace, id} = user
        await user.update({isDeletedPlace: !isDeletedPlace})
        return {user: {id, email: userEmail, name, speciality, phone, role, isDeletedPlace: user.isDeletedPlace}}
    }

    async deleteUser(req, res, next) {
        try {
            const {id} = req.params;
            await User.destroy({where: {id}})
            return res.json({deleted: 'ok'});
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const usersData = await User.findOne({where: {id}, include: [Rights]});
            const processedUser = {...usersData.dataValues}
            delete processedUser.password
            delete processedUser.Rights
            processedUser.rights = usersData.dataValues.Rights
            return res.json(processedUser);
        } catch (e) {
            next(e);
        }
    }

    giveRights(role) {
        switch (role) {
            case 'admin':
                return [{
                    entity: 'applications',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                }, {entity: 'users', create: true, update: true, read: true, delete: true}, {
                    entity: 'checkupPlanPlace',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                }, {
                    entity: 'smetas',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                }]
            case 'superadmin':
                return [{
                    entity: 'applications',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                }, {entity: 'users', create: true, update: true, read: true, delete: true}, {
                    entity: 'checkupPlanPlace',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                },  {
                    entity: 'smetas',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                }]
            case 'doctor':
                return [{
                    entity: 'applications',
                    create: true,
                    update: true,
                    read: true,
                    delete: false
                }, {
                    entity: 'users',
                    create: false,
                    update: false,
                    read: false,
                    delete: false
                }, {entity: 'checkupPlanPlace', create: false, update: false, read: false, delete: false},
                    {
                        entity: 'smetas',
                        create: false,
                        update: false,
                        read: false,
                        delete: false
                    }]
            case 'coordinator':
                return [{
                    entity: 'applications',
                    create: false,
                    update: false,
                    read: true,
                    delete: false
                }, {
                    entity: 'users',
                    create: false,
                    update: false,
                    read: false,
                    delete: false
                }, {
                    entity: 'checkupPlanPlace',
                    create: false,
                    update: false,
                    read: false,
                    delete: false
                }, {
                    entity: 'smetas',
                    create: true,
                    update: true,
                    read: true,
                    delete: true
                }]
        }
    }

    async updateUserRights(entity, field, value, userId) {
        const rightsData = await Rights.findOne({where: {userId, entity}})
        return await rightsData.update({[field]: value})
    }

    async updateUserPrimaryData(email, speciality, phone, name) {
        const user = await User.findOne({where: {email}})
        await user.update({speciality, phone, name})
        return {user}
    }
}

module.exports = new UserService();
