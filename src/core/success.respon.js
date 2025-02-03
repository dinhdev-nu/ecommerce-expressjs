'use strict'

class SuccessResponse {
    constructor({
        message,
        metadata,
    }){
        this.message = message
        this.metadata = metadata
    }
    send(res){
        return res.status(200).json(this)
    }
    sendAndSetToken(res){
        res.cookie(
            process.env.JWT_KEY,
            this.metadata.tokens.refreshToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7*24*60*60*1000
            }
        )
        //res.setHeader('set-cookie', `refreshToken=${this.metadata.tokens.refreshToken}; HttpOnly; Secure; SameSite=Strict;`)
        return res.status(200).json({
            message: this.message,
            metadata: {
                token: this.metadata.tokens.accessToken,
                user: this.metadata.user
            }
        })
    }
}

module.exports = {
    SuccessResponse
}