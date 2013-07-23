Balanced.BankAccount = Balanced.FundingInstrument.extend({
    uri: '/v1/bank_accounts',

    verifications: Balanced.Model.hasMany('Balanced.Verification', 'verifications_uri'),
    verification: Balanced.Model.belongsTo('Balanced.Verification', 'verification_uri'),

    type_name: function () {
        return 'Bank Account';
    }.property(),

    is_bank_account: true,

    description: function () {
        if (this.get('bank_name')) {
            return '{0} ({1})'.format(
                this.get('last_four'),
                Balanced.Utils.toTitleCase(this.get('bank_name'))
            );
        } else {
            return this.get('last_four');
        }
    }.property('last_four', 'bank_name'),

    description_with_type: function () {
        return 'Bank account: {0}'.format(this.get('description'));
    }.property('description'),

    verified: function () {
        return this.get('can_debit') || this.get('verification.state') === 'verified';
    }.property('can_debit', 'verification.state'),

    can_confirm_verification: function() {
        return this.get('verification.state') === 'pending' && this.get('verification.remaining_attempts') > 0;
    }.property('verification.state', 'verification.remaining_attempts')
});

Balanced.TypeMappings.addTypeMapping('bank_account', 'Balanced.BankAccount');
